import { atomWithStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';

import { createMMKVStorage } from '@/lib/jotai/create-mmkv-storage';
import { withSuperJSONStorage } from '@/lib/jotai/with-superjson-storage';

export const atomWithMMKV = <T>(key: string, initialValue: T, storage: MMKV) =>
  atomWithStorage<T>(
    key,
    initialValue,
    withSuperJSONStorage<T>(createMMKVStorage(storage)),
    { getOnInit: true }
  );
