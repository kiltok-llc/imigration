import {
  UseChatOptions,
  useChat as useVercelChat,
  UIMessage as VercelUIMessage,
} from '@ai-sdk/react';
import {
  DefaultChatTransport,
  InferUITools,
  ToolSet,
  validateUIMessages,
} from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { AsyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { MMKV } from 'react-native-mmkv';
import superjson from 'superjson';
import z from 'zod/v4';

export const dataPartSchema = z.object({
  chip: z.object({
    type: z.enum(['end-interview']),
  }),
});

export const metadataSchema = z.object({});

export const tools = {} satisfies ToolSet;

export type UIMessage = VercelUIMessage<
  z.infer<typeof metadataSchema>,
  z.infer<typeof dataPartSchema>,
  InferUITools<typeof tools>
>;

export const createChatMessageStorage = (
  storage: MMKV
): AsyncStorage<VercelUIMessage[]> => ({
  getItem: async (key, initialMessages) => {
    const str = storage.getString(key);
    // console.debug(`storage.getItem(${key}) = ${str}`);

    if (str === undefined) {
      return initialMessages;
    }

    let messages;
    try {
      messages = superjson.parse(str);
    } catch (error) {
      console.warn(
        `Failed to parse mmkv key while reading from storage: ${key}`,
        error,
        str
      );
      return initialMessages;
    }

    try {
      return await validateUIMessages({
        dataSchemas: dataPartSchema.shape,
        messages,
        metadataSchema,
        tools,
      });
    } catch (error) {
      console.warn(
        `Chat message validation failed while reading from storage: ${key}`,
        error
      );
      return initialMessages;
    }
  },
  removeItem: async (key) => {
    // console.debug(`storage.removeItem(${key})`);
    storage.delete(key);
  },
  setItem: async (key, messages) => {
    try {
      await validateUIMessages({
        dataSchemas: dataPartSchema.shape,
        messages,
        metadataSchema,
        tools,
      });
    } catch {
      console.warn(`Wrote new messages to: ${key}, but failed validation!`);
      return;
    }

    let str;
    try {
      str = superjson.stringify(messages);
    } catch (error) {
      console.warn(
        `Wrote new messages to: ${key}, but failed to serialize them!`,
        error,
        messages
      );
      return;
    }

    // console.debug(`storage.setItem(${key}, ${str})`);
    storage.set(key, str);
  },
  subscribe: (key, callback) => {
    const listener = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey !== key) {
        return;
      }

      const str = storage.getString(key);
      // console.debug(`storage.subscribe(${key}) = ${str}`);
      if (str === undefined) {
        console.debug(
          `Chat messages with key: ${key} were deleted, but subscription is active!`
        );
        return;
      }

      try {
        const messages = superjson.parse<VercelUIMessage[]>(str);
        callback(messages);
      } catch (error) {
        console.warn(`Error parsing messages: ${key}`, error, str);
      }
    });
    return () => listener.remove();
  },
});

export const useChat = (options: UseChatOptions<UIMessage>) => {
  return useVercelChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: expoFetch as unknown as typeof globalThis.fetch,
    }),
    ...options,
  });
};
