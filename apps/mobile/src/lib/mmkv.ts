import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { MMKV } from 'react-native-mmkv';
import superjson from 'superjson';

export const storage = new MMKV();

export const createMMKVStorage = <Value>(): SyncStorage<Value> => ({
  getItem: (key, initialValue) => {
    const str = storage.getString(key);
    // console.debug(`mmkvStorage.getItem(${name}) = ${str}`);
    try {
      return superjson.parse<Value>(str ?? '');
    } catch {
      return initialValue;
    }
  },
  removeItem: (key) => {
    // console.debug(`mmkvStorage.removeItem(${name})`);
    storage.delete(key);
  },
  setItem: (name, value) => {
    const str = superjson.stringify(value);
    console.debug(`mmkvStorage.setItem(${name}, ${str})`);
    storage.set(name, str);
  },
  subscribe(name, callback) {
    const listener = storage.addOnValueChangedListener((key) => {
      if (key === name) {
        const str = storage.getString(name);
        // console.debug(`mmkvStorage.subscribe(${name}) = ${str}`);
        try {
          const value = superjson.parse<Value>(str ?? '');
          callback(value);
        } catch (error) {
          console.error(`Error parsing mmkv value with key: ${name}`, error);
        }
      }
    });
    return () => listener.remove();
  },
});
