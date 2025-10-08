import type { CactusOAICompatibleMessage } from 'cactus-react-native';

import { CactusLM } from 'cactus-react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect } from 'react';

const MODEL_DIR = new Directory(Paths.document, 'models');

const MODELS = {
  'qwen2.5-0.5b-instruct-q5_k_m.gguf': {
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q5_k_m.gguf',
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

class CactusManager {
  state: 'error' | 'initialized' | 'initializing' | 'uninitialized' =
    'uninitialized';

  private lm: CactusLM | null = null;

  async _initialize() {
    console.debug('[Cactus] initializing...');
    this.state = 'initializing';

    // eslint-disable-next-line unicorn/no-single-promise-in-promise-methods
    const [modelPath] = await Promise.all([
      downloadModel('qwen2.5-0.5b-instruct-q5_k_m.gguf'),
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
  }

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
    if (this.state === 'initialized') {
      console.log('[Cactus] already initialized');
      return;
    }

    if (this.state === 'initializing') {
      console.log('[Cactus] already initializing');
      return;
    }

    try {
      await this._initialize();
    } catch (error) {
      console.error('[Cactus] initialization failed', error);
      this.state = 'error';
      return;
    }

    console.log('[Cactus] initialization complete');
    this.state = 'initialized';
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

export const cactus = new CactusManager();

export const useLoadCactus = () => {
  useEffect(() => {
    if (cactus.state === 'initialized') {
      return;
    }

    void cactus.initialize();
  }, []);
};
