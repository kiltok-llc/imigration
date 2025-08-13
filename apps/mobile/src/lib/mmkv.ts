import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { MMKV } from 'react-native-mmkv';
import superjson from 'superjson';

export const defaultStorage = new MMKV({ id: 'mmkv.default' });

export const devStorage = new MMKV({ id: 'mmkv.dev' });

export const createMMKVStorage = <Value>(
  storage: MMKV
): SyncStorage<Value> => ({
  getItem: (key, initialValue) => {
    const str = storage.getString(key);
    // console.debug(`storage.getItem(${key}) = ${str}`);
    try {
      return superjson.parse<Value>(str ?? '');
    } catch {
      return initialValue;
    }
  },
  removeItem: (key) => {
    // console.debug(`storage.removeItem(${key})`);
    storage.delete(key);
  },
  setItem: (key, value) => {
    const str = superjson.stringify(value);
    // console.debug(`storage.setItem(${key}, ${str})`);
    storage.set(key, str);
  },
  subscribe(key, callback) {
    const listener = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey !== key) {
        return;
      }

      const str = storage.getString(key);
      // console.debug(`storage.subscribe(${key}) = ${str}`);
      try {
        const value = superjson.parse<Value>(str ?? '');
        callback(value);
      } catch (error) {
        console.warn(
          `Error parsing mmkv value in subscription with key: ${key}`,
          error,
          str
        );
      }
    });
    return () => listener.remove();
  },
});
