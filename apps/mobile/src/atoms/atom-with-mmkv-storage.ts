import { atomWithStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';
import z from 'zod/v4';

import { createMMKVStorage } from '@/lib/mmkv';

export const atomWithMmkvStorage = <T>(
  key: string,
  initialValue: T,
  schema: z.ZodType<T>,
  storage: MMKV
) => {
  return atomWithStorage<T>(
    key,
    initialValue,
    createMMKVStorage(storage, schema),
    {
      getOnInit: __DEV__,
    }
  );
};
