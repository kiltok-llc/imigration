import { SyncStringStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { MMKV } from 'react-native-mmkv';

export const createMMKVStorage = (storage: MMKV): SyncStringStorage => ({
  getItem: (key: string) => {
    // console.debug(`[MMKVStorage] get(${key})`);
    return storage.getString(key) ?? null;
  },

  removeItem: (key: string) => {
    // console.debug(`[MMKVStorage] delete(${key})`);
    storage.delete(key);
  },

  setItem: (key: string, value: string) => {
    // console.debug(`[MMKVStorage] set(${key})`);
    storage.set(key, value);
  },

  subscribe: (key: string, callback: (value: null | string) => void) => {
    const { remove } = storage.addOnValueChangedListener(
      (changedKey: string) => {
        if (changedKey === key) {
          // console.debug(`[MMKVStorage] valueChanged(${key})`);
          callback(storage.getString(key) ?? null);
        }
      }
    );

    return () => {
      remove();
    };
  },
});
