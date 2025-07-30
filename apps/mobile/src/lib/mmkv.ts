import { SyncStringStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { MMKV, useMMKVListener } from 'react-native-mmkv';

export const storage = new MMKV();

export const mmkvStorage: SyncStringStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    // console.debug(`mmkvStateStorage.getItem(${name})`, value);
    return value ?? null;
  },
  removeItem: (name) => {
    // console.debug(`mmkvStateStorage.removeItem(${name})`);
    storage.delete(name);
  },
  setItem: (name, value) => {
    // console.debug(`mmkvStateStorage.setItem(${name}, ${value})`);
    storage.set(name, value);
  },
  subscribe(name, callback) {
    const listener = storage.addOnValueChangedListener((key) => {
      if (key === name) {
        const value = storage.getString(name);
        // console.debug(`mmkvStateStorage.subscribe(${name})`, value);
        callback(value ?? null);
      }
    })
    return () => listener.remove();
  }
};
