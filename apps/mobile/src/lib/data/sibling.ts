import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import { NameSchema } from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';
import { SexEnum } from '@/lib/schemas';

export const siblingIdsAtom = atomWithMmkvStorage(
  `sibling-ids`,
  [],
  z.array(z.uuid()),
  defaultStorage
);

export const siblingNameAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `sibling:${id}:name`,
    DEFAULT_FORM_NAME,
    NameSchema,
    defaultStorage
  )
);

export const siblingSexAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `sibling:${id}:sex`,
    null,
    SexEnum.nullable(),
    defaultStorage
  )
);

export const siblingDobAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `sibling:${id}:dob`,
    null,
    z.date().nullable(),
    defaultStorage
  )
);

export const siblingLivesInUsaAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `sibling:${id}:lives-in-usa`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);
