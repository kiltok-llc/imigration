import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import {
  AlienNumberSchema,
  DEFAULT_ALIEN_NUMBER,
  DEFAULT_LOCATION,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  LocationSchema,
  NameSchema,
  PassportSchema,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';
import { ImmigrationCourtStatusEnum, SexEnum } from '@/lib/schemas';

export const spouseAlienNumberAtom = atomWithMmkvStorage(
  'spouse:alienNumber',
  DEFAULT_ALIEN_NUMBER,
  AlienNumberSchema,
  defaultStorage
);

export const spouseEntriesAtom = atomWithMmkvStorage(
  'spouse:entries',
  [],
  z.array(UsaEntrySchema),
  defaultStorage
);

export const spouseStatusExpirationAtom = atomWithMmkvStorage(
  'spouse:status-expiration',
  null,
  z.date().nullable(),
  defaultStorage
);

export const spouseImmigrationCourtStatusAtom = atomWithMmkvStorage(
  'spouse:immigration-court-status',
  null,
  ImmigrationCourtStatusEnum.nullable(),
  defaultStorage
);

export const spouseNameAtom = atomWithMmkvStorage(
  'spouse:name',
  DEFAULT_FORM_NAME,
  NameSchema,
  defaultStorage
);

export const spousePassportAtom = atomWithMmkvStorage(
  'spouse:passport',
  DEFAULT_PASSPORT,
  PassportSchema,
  defaultStorage
);

export const spouseIsInUsaAtom = atomWithMmkvStorage(
  'spouse:is-in-usa',
  null,
  z.boolean().nullable(),
  defaultStorage
);

export const spouseLocationAtom = atomWithMmkvStorage(
  'spouse:location',
  DEFAULT_LOCATION,
  LocationSchema,
  defaultStorage
);

export const spouseSexAtom = atomWithMmkvStorage(
  'spouse:sex',
  null,
  SexEnum.nullable(),
  defaultStorage
);

export const spouseSsnAtom = atomWithMmkvStorage(
  'spouse:ssn',
  DEFAULT_SSN,
  SsnSchema,
  defaultStorage
);

export const spouseUscisNumberAtom = atomWithMmkvStorage(
  'spouse:uscis-number',
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema,
  defaultStorage
);
