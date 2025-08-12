import { atomWithStorage, unstable_withStorageValidator as withStorageValidator } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';
import z from 'zod/v4';

import { createMMKVStorage, defaultStorage } from '@/lib/mmkv';

export const atomWithMmkvStorage = <T>(
  key: string,
  initialValue: T,
  schema?: z.ZodType<T>,
  storage: MMKV = defaultStorage,
) => {
  const validator = (v: unknown): v is T =>
    !schema || schema.safeParse(v).success;
  return atomWithStorage<T>(
    key,
    initialValue,
    withStorageValidator<T>(validator)(createMMKVStorage(storage)),
    {
      getOnInit: true,
    },
  );
};
