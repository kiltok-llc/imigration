import {
  atomWithStorage,
  createJSONStorage,
  unstable_withStorageValidator as withStorageValidator,
} from 'jotai/utils';
import z from 'zod/v4';

import { mmkvStorage } from '@/lib/mmkv';

export const atomWithMmkvStorage = <T>(
  key: string,
  initialValue: T,
  schema: z.ZodType<T>
) => {
  const validator = (v: unknown): v is T => schema.safeParse(v).success;
  return atomWithStorage<T>(
    key,
    initialValue,
    withStorageValidator<T>(validator)(createJSONStorage(() => mmkvStorage)),
    {
      getOnInit: true,
    }
  );
};
