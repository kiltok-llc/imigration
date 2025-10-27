import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import {
  AlienNumberSchema,
  DEFAULT_ALIEN_NUMBER,
  DEFAULT_LOCATION,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  ImmigrationCourtStatusEnum,
  LocationSchema,
  NameSchema,
  PassportSchema,
  SexEnum,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';

export const spouseAlienNumberAtom = atomWithMMKVZod(
  'spouse:alienNumber',
  DEFAULT_ALIEN_NUMBER,
  AlienNumberSchema,
  defaultStorage
);

export const spouseEntriesAtom = atomWithMMKVZod(
  'spouse:entries',
  [],
  z.array(UsaEntrySchema),
  defaultStorage
);

export const spouseStatusExpirationAtom = atomWithMMKVZod(
  'spouse:status-expiration',
  null,
  z.date().nullable(),
  defaultStorage
);

export const spouseImmigrationCourtStatusAtom = atomWithMMKVZod(
  'spouse:immigration-court-status',
  null,
  ImmigrationCourtStatusEnum.nullable(),
  defaultStorage
);

export const spouseNameAtom = atomWithMMKVZod(
  'spouse:name',
  DEFAULT_FORM_NAME,
  NameSchema,
  defaultStorage
);

export const spousePassportAtom = atomWithMMKVZod(
  'spouse:passport',
  DEFAULT_PASSPORT,
  PassportSchema,
  defaultStorage
);

export const spouseIsInUsaAtom = atomWithMMKVZod(
  'spouse:is-in-usa',
  null,
  z.boolean().nullable(),
  defaultStorage
);

export const spouseLocationAtom = atomWithMMKVZod(
  'spouse:location',
  DEFAULT_LOCATION,
  LocationSchema,
  defaultStorage
);

export const spouseSexAtom = atomWithMMKVZod(
  'spouse:sex',
  null,
  SexEnum.nullable(),
  defaultStorage
);

export const spouseSsnAtom = atomWithMMKVZod(
  'spouse:ssn',
  DEFAULT_SSN,
  SsnSchema,
  defaultStorage
);

export const spouseUscisNumberAtom = atomWithMMKVZod(
  'spouse:uscis-number',
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema,
  defaultStorage
);
