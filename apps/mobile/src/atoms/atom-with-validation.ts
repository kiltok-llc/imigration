import { atom, PrimitiveAtom } from 'jotai';
import { z } from 'zod/v4';

export const atomWithValidation = <T>(
  baseAtom: PrimitiveAtom<T>,
  schema: z.ZodType<T>
) => {
  const errorAtom = atom<z.ZodError<T>>();
  const prevValue = atom();

  return atom(
    (get) => ({
      error: get(errorAtom),
      isDirty: get(prevValue) !== get(baseAtom),
    }),
    (get, set) => {
      const { error, success } = schema.safeParse(get(baseAtom));
      set(errorAtom, error);
      set(prevValue, get(baseAtom));
      return success;
    }
  );
};
