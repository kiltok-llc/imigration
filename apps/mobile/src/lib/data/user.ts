import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atoms/object-property-atom-family';
import { MaritalStatusEnum } from '@/lib/schema/common';

export const UserDataSchema = z
  .object({
    maritalStatus: MaritalStatusEnum,
    numberOfChildren: z.number(),
    passport: z
      .object({
        country: z.string(),
        number: z.string(),
      })
      .partial()
      .nullable(),
  })
  .partial();

const userDataAtom = atomWithMmkvStorage('userData', {}, UserDataSchema);

export const userDataFamily = objectPropertyAtomFamily(userDataAtom);
