import {
  atomWithStorage,
  createJSONStorage,
  unstable_withStorageValidator as withStorageValidator,
} from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';
import superjson from 'superjson';
import z from 'zod/v4';

import { createMMKVStorage } from '@/lib/jotai/create-mmkv-storage';
import { withSuperJSONStorage } from '@/lib/jotai/with-superjson-storage';

export const atomWithMMKVZod = <T>(
  key: string,
  initialValue: T,
  schema: z.ZodType<T>,
  storage: MMKV
) =>
  atomWithStorage<T>(
    key,
    initialValue,
    withStorageValidator<T>((v): v is T => schema.safeParse(v).success)(
      withSuperJSONStorage(createMMKVStorage(storage))
    ),
    { getOnInit: true }
  );
