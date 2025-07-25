import { type StateStorage } from 'zustand/middleware';

import { storage } from '@/lib/mmkv';

export const zustandStorage: StateStorage = {
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
