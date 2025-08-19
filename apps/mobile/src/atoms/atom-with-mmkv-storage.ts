import { atomWithStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';
import z from 'zod/v4';

import { createMMKVStorage, defaultStorage } from '@/lib/mmkv';

export const atomWithMmkvStorage = <T>(
  key: string,
  initialValue: T,
  schema?: z.ZodType<unknown, T>,
  storage: MMKV = defaultStorage
) => {
  const validator = (v: unknown): v is T =>
    schema?.safeParse(v)?.success ?? true;
  return atomWithStorage<T>(
    key,
    initialValue,
    createMMKVStorage(storage, validator)
  );
};
