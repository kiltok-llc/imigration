import {
  SyncStorage,
  SyncStringStorage,
} from 'jotai/vanilla/utils/atomWithStorage';
import superjson from 'superjson';

export const withSuperJSONStorage = <T>(
  storage: SyncStringStorage
): SyncStorage<T> => ({
  getItem: (key, initialValue) => {
    const str = storage.getItem(key);
    if (str === null) {
      return initialValue;
    }

    try {
      return superjson.parse<T>(str);
    } catch (error) {
      console.warn('failed to parse stored value', error);
      return initialValue;
    }
  },
  removeItem: (key) => storage.removeItem(key),
  setItem: (key, newValue) =>
    storage.setItem(key, superjson.stringify(newValue)),
  ...(storage.subscribe === undefined
    ? {}
    : {
        subscribe: (key, callback, initialValue) =>
          storage.subscribe?.(key, (v) => {
            if (v === null) {
              callback(initialValue);
              return;
            }

            try {
              callback(superjson.parse<T>(v));
            } catch (error) {
              console.warn('failed to parse stored value', error);
              callback(initialValue);
            }
          }),
      }),
});
