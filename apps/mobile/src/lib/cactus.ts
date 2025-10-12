import type { CactusOAICompatibleMessage } from 'cactus-react-native';

import { CactusLM } from 'cactus-react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { atomWithMutation } from 'jotai-tanstack-query';
import { useEffect } from 'react';

const MODEL_DIR = new Directory(Paths.document, 'models');

const MODELS = {
  'Qwen3-0.6B-Q8_0.gguf': {
    url: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf',
  },
};

type ModelName = keyof typeof MODELS;

const STOP_WORDS = [
  '<|end_of_text|>',
  '<|endoftext|>',
  '<|im_end|>',
  '</s>',
  '<end_of_utterance>',
];

type CactusManagerState =
  | DestroyingState
  | ErrorState
  | InitializedState
  | InitializingState
  | UninitializedState;
type DestroyingState = { cactus?: never; status: 'destroying' };
type ErrorState = { cactus?: never; status: 'error' };
type InitializedState = { cactus: Cactus; status: 'initialized' };
type InitializingState = { cactus?: never; status: 'initializing' };
type UninitializedState = { cactus?: never; status: 'uninitialized' };

const cactusAtom = atom<CactusManagerState>({ status: 'uninitialized' });

const defaultStore = getDefaultStore();

const initializeCactusAtom = atomWithMutation((get) => ({
  meta: {
    errorToastKey: 'chat.toast.init-error',
    loadingToastKey: 'chat.toast.init-loading',
  },
  mutationFn: async (): Promise<Cactus> => {
    const { status } = get(cactusAtom);
    if (status !== 'uninitialized') {
      throw new Error(
        `[Cactus] cannot initialize from current state: ${status}`
      );
    }

    defaultStore.set(cactusAtom, { status: 'initializing' });
    return await Cactus.initialize();
  },
  onError: () => defaultStore.set(cactusAtom, { status: 'error' }),
  onSuccess: (cactus) =>
    defaultStore.set(cactusAtom, { cactus, status: 'initialized' }),
  retry: 5,
}));

const destroyCactusAtom = atomWithMutation((get) => ({
  mutationFn: async () => {
    const { cactus, status } = get(cactusAtom);
    if (status !== 'initialized') {
      throw new Error(`[Cactus] cannot destroy from current state: ${status}`);
    }

    defaultStore.set(cactusAtom, { status: 'destroying' });
    await cactus.destroy();
  },
  onError: (error) => {
    // We would rather leak the memory and pretend teardown succeeded than to
    // lock up cactus by setting the error state.
    // defaultStore.set(cactusAtom, { status: 'error' })
    console.warn('[Cactus] error during destroy, ignoring', error);
    defaultStore.set(cactusAtom, { status: 'uninitialized' });
  },
  onSuccess: () => defaultStore.set(cactusAtom, { status: 'uninitialized' }),
  retry: 2,
}));

class Cactus {
  private lm: CactusLM;

  constructor(lm: CactusLM) {
    this.lm = lm;
  }

  static async initialize(): Promise<Cactus> {
    console.debug('[Cactus] initializing...');

    // eslint-disable-next-line unicorn/no-single-promise-in-promise-methods
    const [modelPath] = await Promise.all([
      downloadModel('Qwen3-0.6B-Q8_0.gguf'),
    ]);

    const { error, lm } = await CactusLM.init({
      model: modelPath.uri,
      n_batch: 256,
      n_ctx: 2048,
      n_threads: 4,
    });

    if (error || !lm) {
      throw error || new Error('Unknown error initializing Cactus LM');
    }

    return new Cactus(lm);
  }

  async destroy() {
    console.debug('[Cactus] destroying...');

    await this.lm.release();
  }

  async generateResponse(
    messages: CactusOAICompatibleMessage[]
  ): Promise<string> {
    const startTime = performance.now();
    let firstTokenTime: null | number = null;
    let responseText = '';

    const result = await this.lm.completion(
      messages,
      {
        min_p: 0,
        n_predict: 512,
        penalty_present: 1.5,
        penalty_repeat: 1.05,
        stop: STOP_WORDS,
        temperature: 0.7,
        top_k: 20,
        top_p: 0.8,
      },
      ({ token }) => {
        if (firstTokenTime === null && token) {
          firstTokenTime = performance.now();
        }
        if (token) {
          responseText += token;
        }
      }
    );

    responseText = responseText || result.text || 'No response generated';

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const timeToFirstToken = firstTokenTime
      ? firstTokenTime - startTime
      : totalTime;
    const tokenCount = responseText.split(/\s+/).length;
    const tokensPerSecond =
      tokenCount > 0 ? tokenCount / (totalTime / 1000) : 0;

    console.log(
      `[Cactus] TTFT ${timeToFirstToken.toFixed(0)}ms | ${tokensPerSecond.toFixed(0)} tok/s | ${tokenCount} tokens`
    );

    const THINK_END = '</think>';
    const thinkEndIdx = responseText.indexOf(THINK_END);
    return responseText.slice(thinkEndIdx + THINK_END.length).trim();
  }
}

async function downloadModel(modelName: ModelName): Promise<File> {
  const { url } = MODELS[modelName];
  const modelFile = new File(MODEL_DIR, modelName);

  if (!modelFile.exists) {
    const downloadFile = await File.downloadFileAsync(url, Paths.cache);
    modelFile.parentDirectory.create({ idempotent: true, intermediates: true });
    downloadFile.move(modelFile);
  }

  return modelFile;
}

export const useCactus = () => {
  const { mutate: initializeCactus } = useAtomValue(initializeCactusAtom);
  const { mutate: destroyCactus } = useAtomValue(destroyCactusAtom);

  useEffect(() => {
    initializeCactus();

    return () => {
      void destroyCactus();
    };
  }, [initializeCactus, destroyCactus]);

  return useAtomValue(cactusAtom);
};
