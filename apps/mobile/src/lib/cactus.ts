import type { CactusOAICompatibleMessage } from 'cactus-react-native';

import { CactusLM } from 'cactus-react-native';
import { File, Paths } from 'expo-file-system';
import { createDownloadResumable } from 'expo-file-system/legacy';

const MODEL_DIR = `${Paths.document}/models`;

const MODELS = {
  'qwen2.5-0.5b-instruct-q5_k_m.gguf': {
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q5_k_m.gguf',
  },
};

type ModelName = keyof typeof MODELS;

const STOP_WORDS = [
  '<|end_of_text|>',
  '<|endoftext|>',
  '</s>',
  '<end_of_utterance>',
];

class CactusManager {
  initProgress = 0;
  isInitialized = false;

  private lm: CactusLM | null = null;

  async generateResponse(
    messages: CactusOAICompatibleMessage[]
  ): Promise<string> {
    if (!this.lm) {
      console.log('[Cactus] LM not initialized');
      return '';
    }

    const startTime = performance.now();
    let firstTokenTime: null | number = null;
    let responseText = '';

    const result = await this.lm.completion(
      messages,
      {
        n_predict: 256,
        penalty_repeat: 1.05,
        stop: STOP_WORDS,
        temperature: 0.7,
        top_p: 0.9,
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

    return responseText;
  }

  async initialize() {
    if (this.isInitialized) return;

    const fileProgress = new Map<string, number>();
    const onFileProgress = (progress: number, file: string) => {
      console.debug(
        `[Cactus] downloading ${file}: ${(progress * 100).toFixed(2)}%`
      );
      fileProgress.set(file, progress);
      const totalProgress = fileProgress.values().reduce((a, b) => a + b, 0);
      this.initProgress = totalProgress / Object.keys(MODELS).length;
    };

    // eslint-disable-next-line unicorn/no-single-promise-in-promise-methods
    const [modelPath] = await Promise.all([
      downloadModel('qwen2.5-0.5b-instruct-q5_k_m.gguf', onFileProgress),
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

    this.lm = lm;
    this.isInitialized = true;
  }
}

async function downloadModel(
  modelName: ModelName,
  onProgress: (progress: number, file: string) => void
): Promise<File> {
  const { url } = MODELS[modelName];
  const filePath = new File(MODEL_DIR, modelName);

  if (!filePath.exists) {
    const { md5: _md5 } = await createDownloadResumable(
      url,
      filePath.uri,
      {
        md5: true,
      },
      ({ totalBytesExpectedToWrite, totalBytesWritten }) =>
        onProgress(totalBytesWritten / totalBytesExpectedToWrite, modelName)
    )
      .downloadAsync()
      .then((res) => res!);

    // TODO check md5
  }

  return filePath;
}

export const cactus = new CactusManager();
