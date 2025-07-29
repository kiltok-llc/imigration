import { MMKV } from 'react-native-mmkv';
import { type StateStorage } from 'zustand/middleware';

export const storage = new MMKV();

export const mmkvStateStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.delete(name);
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
};
