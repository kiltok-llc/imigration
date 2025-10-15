import { useMutation } from '@tanstack/react-query';
import {
  CactusLM,
  CactusOAICompatibleMessage,
  parseAndExecuteTool,
  Tools,
} from 'cactus-react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const MODEL_DIR = new Directory(Paths.document, 'models');
const MODELS = {
  'Qwen3-0.6B-Q8_0.gguf': {
    url: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf',
  },
  'Qwen3-1.7B-Q4_K_S.gguf': {
    url: 'https://huggingface.co/unsloth/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_S.gguf',
  },
};

export type CactusActionChip = {
  description: string;
  id: string;
};

type CactusManagerState =
  | DestroyingState
  | InitializedState
  | InitializingState
  | UninitializedState;
type DestroyingState = { cactus?: never; status: 'destroying' };
type InitializedState = { cactus: Cactus; status: 'initialized' };
type InitializingState = { cactus?: never; status: 'initializing' };
type Message = CactusOAICompatibleMessage & {
  chipIds?: string[];
};
type ModelName = keyof typeof MODELS;
type UninitializedState = { cactus?: never; status: 'uninitialized' };

const cactusAtom = atom<CactusManagerState>({ status: 'uninitialized' });

const defaultStore = getDefaultStore();

const useDownloadCactusModels = () =>
  useMutation({
    meta: {
      errorToastKey: 'chat.toast.download-error',
    },
    mutationFn: async () => {
      const { status } = defaultStore.get(cactusAtom);
      if (status === 'initialized') {
        console.debug(`[Cactus] skipping download, already ${status}`);
        return;
      }

      if (status !== 'uninitialized') {
        // error here so that we can retry the download later
        throw new Error(`cannot download models from current state: ${status}`);
      }

      defaultStore.set(cactusAtom, { status: 'initializing' });
      try {
        await Cactus.downloadModels();
      } catch (error) {
        defaultStore.set(cactusAtom, { status: 'uninitialized' });
        throw new Error('failed to download models', { cause: error });
      }

      console.debug('[Cactus] models downloaded!');
      defaultStore.set(cactusAtom, { status: 'uninitialized' });
    },
    mutationKey: ['downloadModels'],
    retry: 3,
  });

const useInitCactus = () =>
  useMutation({
    meta: {
      errorToastKey: 'chat.toast.init-error',
      loadingToastKey: 'chat.toast.init-loading',
    },
    mutationFn: async () => {
      const { status } = defaultStore.get(cactusAtom);
      if (status === 'initialized') {
        console.debug(`[Cactus] skipping init, already ${status}`);
        return;
      }

      if (status !== 'uninitialized') {
        // error here so that we can retry the init later
        throw new Error(`cannot initialize from current state: ${status}`);
      }

      defaultStore.set(cactusAtom, { status: 'initializing' });
      try {
        const cactus = await Cactus.initialize();
        defaultStore.set(cactusAtom, { cactus, status: 'initialized' });
      } catch (error) {
        defaultStore.set(cactusAtom, { status: 'uninitialized' });
        throw new Error('failed to initialize cactus', { cause: error });
      }

      console.debug('[Cactus] initialized!');
    },
    retry: 5,
  });

const useDestroyCactus = () =>
  useMutation({
    mutationFn: async () => {
      const { cactus, status } = defaultStore.get(cactusAtom);
      if (status === 'uninitialized') {
        console.debug(`[Cactus] skipping destroy, already ${status}`);
        return; // already destroyed
      }

      if (status !== 'initialized') {
        throw new Error(`cannot destroy from current state: ${status}`);
      }

      defaultStore.set(cactusAtom, { status: 'destroying' });
      try {
        await cactus.destroy();
      } catch (error) {
        // Even if destroy fails, we can just set the state to uninitialized
        defaultStore.set(cactusAtom, { status: 'uninitialized' });
        throw new Error('failed to destroy cactus', { cause: error });
      }

      console.debug('[Cactus] destroyed!');
      defaultStore.set(cactusAtom, { status: 'uninitialized' });
    },
    // Retrying failed destroys would not do anything except hide errors,
    // since we pretend the destruction succeeded (by setting state
    // uninitialized) even if it failed.
    retry: false,
  });

function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return arr.reduce(
    (acc, item) => {
      acc[predicate(item) ? 0 : 1].push(item);
      return acc;
    },
    [[], []] as [T[], T[]]
  );
}

const MESSAGE_HISTORY_LIMIT = 16; // TODO summarize old messages instead

class Cactus {
  private lm: CactusLM;

  constructor(lm: CactusLM) {
    this.lm = lm;
  }

  static async downloadModels() {
    console.debug('[Cactus] downloading models...');
    return [await downloadModel('Qwen3-1.7B-Q4_K_S.gguf')] as const;
  }

  static async initialize(): Promise<Cactus> {
    console.debug('[Cactus] initializing...');

    const [modelPath] = await Cactus.downloadModels();

    const { error, lm } = await CactusLM.init({
      model: modelPath.uri,
      n_batch: 256,
      n_ctx: 2048,
      n_threads: 4,
    });

    if (error || !lm) {
      lm?.release(); // TODO would be nice to fix this typing in cactus-react-native
      throw error || new Error('unknown error initializing CactusLM');
    }

    return new Cactus(lm);
  }

  async destroy() {
    console.debug('[Cactus] destroying...');

    await this.lm.release();
  }

  async generateResponse(
    messages: Message[],
    availableChips: CactusActionChip[] = [],
    onChip: (chip: string) => void = () => {},
    recursionCount: number = 0,
    recursionLimit: number = 3
  ): Promise<string> {
    console.debug('[Cactus] messages', messages);

    const [systemMessages, conversationMessages] = partition(
      messages,
      ({ role }) => role === 'system'
    );
    if (conversationMessages.length > MESSAGE_HISTORY_LIMIT) {
      // TODO summarize old messages instead of dropping them
      console.debug('[Cactus] trimming message history', {
        conversationMessages: conversationMessages.length,
        messageLimit: MESSAGE_HISTORY_LIMIT,
        totalMessages: messages.length,
      });

      return await this.generateResponse(
        [
          ...systemMessages,
          ...conversationMessages.slice(-MESSAGE_HISTORY_LIMIT),
        ],
        [],
        onChip,
        recursionCount, // don't count this as a recursion
        recursionLimit
      );
    }

    const tools = new Tools();
    addChipsTool(tools, availableChips);

    const startTime = performance.now();
    let firstTokenTime: null | number = null;

    const result = await this.lm.completion(
      messages,
      {
        jinja: true,
        min_p: 0,
        n_predict: 2048,
        penalty_present: 1.5,
        penalty_repeat: 1.05,
        stop: ['<|im_end|>'],
        temperature: 0.7,
        tool_choice: 'auto',
        tools: tools.getSchemas(),
        top_k: 20,
        top_p: 0.8,
      },
      ({ token }) => {
        if (firstTokenTime === null && token) {
          firstTokenTime = performance.now();
        }
      }
    );

    const {
      content,
      stopped_eos,
      timings: { predicted_n, predicted_per_second },
      tokens_evaluated,
      tokens_predicted,
      truncated,
    } = result;

    console.debug('[Cactus] predicted', result);

    const { toolCalled, toolInput, toolName, toolOutput } =
      await parseAndExecuteTool(result, tools ?? new Tools());

    if (toolCalled) {
      console.debug(
        `[Cactus] executed tool ${toolName}(${JSON.stringify(toolInput, null, 2)}) -> ${JSON.stringify(toolOutput, null, 2)}`
      );

      let chip: null | string = null;
      console.log(toolName);
      if (toolName === 'showActionChip') {
        chip = toolInput.id;
        onChip(chip!);
      }

      return await this.generateResponse(
        [
          ...messages,
          {
            content: JSON.stringify(toolOutput) ?? '',
            role: 'tool',
            tool_call_id: result?.tool_calls?.[0]?.id,
          },
        ],
        chip ? availableChips.filter((c) => c.id !== chip) : availableChips,
        onChip,
        recursionCount + 1,
        recursionLimit
      );
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const timeToFirstToken = firstTokenTime
      ? firstTokenTime - startTime
      : totalTime;

    console.debug(
      `[Cactus] TTFT ${timeToFirstToken.toFixed(0)}ms | ${predicted_per_second.toFixed(0)} tok/s | ${predicted_n} tokens`
    );

    if (truncated) {
      console.warn('[Cactus] context window was truncated', {
        tokens_evaluated,
        tokens_predicted,
      });
    }

    if (!stopped_eos) {
      throw new Error('[Cactus] generation did not complete');
    }

    let response = content.trim();

    const THINK_END = '</think>';
    if (response.includes(THINK_END)) {
      console.warn('[Cactus] response content contains think tags!');
      response = response.split(THINK_END)[1]!.trim();
    }

    return response;
  }
}

function addChipsTool(tools: Tools, chips: CactusActionChip[]) {
  tools.add(
    function showActionChip(type: string) {
      console.warn(`[Cactus] showActionChip called with type: ${type}`);

      return `Action chip ${type} will be shown with your next message.`;
    },
    [
      'Append an action chip to the next assistant message that the user can press to perform a specific action.',
      'Available action chips:',
      ...chips.map(({ description, id }) => `- ${id}: ${description}`),
    ].join('\n'),
    {
      id: {
        description: 'Which action chip to show.',
        // @ts-expect-error cactus-react-native typing is wrong here
        enum: chips.map(({ id }) => id),
        required: true,
        type: 'string',
      },
    }
  );
}

async function downloadModel(modelName: ModelName): Promise<File> {
  const { url } = MODELS[modelName];
  const modelFile = new File(MODEL_DIR, modelName);

  if (!modelFile.exists) {
    const downloadFile = await File.downloadFileAsync(url, Paths.cache, {
      idempotent: true,
    });
    modelFile.parentDirectory.create({ idempotent: true, intermediates: true });
    downloadFile.move(modelFile);
  }

  return modelFile;
}

export const useCactus = () => {
  const { mutate: initCactus } = useInitCactus();
  const { mutate: destroyCactus } = useDestroyCactus();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        switch (status) {
          case 'active': {
            initCactus();
            break;
          }
          case 'background': {
            destroyCactus();
            break;
          }
        }
      }
    );

    initCactus();

    return () => {
      subscription.remove();

      destroyCactus();
    };
  }, [destroyCactus, initCactus]);

  return useAtomValue(cactusAtom);
};

export const useEnsureDownloadCactusModels = () => {
  const { mutate: downloadModels } = useDownloadCactusModels();

  useEffect(() => {
    downloadModels();
  }, [downloadModels]);
};
