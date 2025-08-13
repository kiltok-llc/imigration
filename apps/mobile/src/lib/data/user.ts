import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atoms/object-property-atom-family';
import { MaritalStatusEnum } from '@/lib/schema/common';

export const UserDataSchema = z
  .object({
    maritalStatus: MaritalStatusEnum,
    numberOfChildren: z.number(),
  })
  .partial();

const userDataAtom = atomWithMmkvStorage('userData', {}, UserDataSchema);

export const userDataFamily = objectPropertyAtomFamily(userDataAtom);
