import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import { NameSchema, SexEnum } from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';

export const siblingIdsAtom = atomWithMMKVZod(
  `sibling-ids`,
  [],
  z.array(z.uuid()),
  defaultStorage
);

export const siblingNameAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `sibling:${id}:name`,
    DEFAULT_FORM_NAME,
    NameSchema,
    defaultStorage
  )
);

export const siblingSexAtom = atomFamily((id) =>
  atomWithMMKVZod(`sibling:${id}:sex`, null, SexEnum.nullable(), defaultStorage)
);

export const siblingDobAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `sibling:${id}:dob`,
    null,
    z.date().nullable(),
    defaultStorage
  )
);

export const siblingLivesInUsaAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `sibling:${id}:lives-in-usa`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);
