import { validateUIMessages } from 'ai';
import { AsyncStorage, SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

import {
  dataPartSchema,
  metadataSchema,
  tools,
  UIMessage,
} from '@/lib/chat/schema';

export const withMessageValidator = (
  unknownStorage: SyncStorage<unknown>
): AsyncStorage<UIMessage[]> => ({
  getItem: async (key, initialValue) => {
    const messages = unknownStorage.getItem(key, initialValue);

    try {
      return await validateUIMessages<UIMessage>({
        dataSchemas: dataPartSchema.shape,
        messages,
        metadataSchema,
        tools,
      });
    } catch (error) {
      console.error('failure validating ui chat messages', error);
      return initialValue;
    }
  },
  removeItem: async (key) => unknownStorage.removeItem(key),
  setItem: async (key, newValue) => unknownStorage.setItem(key, newValue),
  ...(unknownStorage.subscribe === undefined
    ? {}
    : {
        subscribe: (key, callback, initialValue) =>
          unknownStorage.subscribe?.(
            key,
            (v) => callback(v as UIMessage[]),
            initialValue
          ),
      }),
});
