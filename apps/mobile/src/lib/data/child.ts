import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import {
  AlienNumberSchema,
  DEFAULT_ALIEN_NUMBER,
  DEFAULT_NAME,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  NameSchema,
  PassportSchema,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';
import { ImmigrationCourtStatusEnum, SexEnum } from '@/lib/schemas';

export const childIdsAtom = atomWithMmkvStorage(
  `child-ids`,
  [],
  z.array(z.uuid()),
  defaultStorage
);

export const childDobAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:dob`,
    null,
    z.date().nullable(),
    defaultStorage
  )
);

export const childEthnicityAtom = atomFamily((id) =>
  atomWithMmkvStorage(`child:${id}:ethnicity`, '', z.string(), defaultStorage)
);

export const childAlienNumberAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:alien-number`,
    DEFAULT_ALIEN_NUMBER,
    AlienNumberSchema,
    defaultStorage
  )
);

export const childEntriesAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:entries`,
    [],
    z.array(UsaEntrySchema),
    defaultStorage
  )
);

export const childStatusExpirationAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:status-expiration`,
    null,
    z.date().nullable(),
    defaultStorage
  )
);

export const childIsInUsaAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:is-in-usa`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);

export const childImmigrationCourtStatusAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:immigration-court-status`,
    null,
    ImmigrationCourtStatusEnum.nullable(),
    defaultStorage
  )
);

export const childNameAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:name`,
    DEFAULT_NAME,
    NameSchema,
    defaultStorage
  )
);

export const childPassportAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:passport`,
    DEFAULT_PASSPORT,
    PassportSchema,
    defaultStorage
  )
);

export const childSexAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:sex`,
    null,
    SexEnum.nullable(),
    defaultStorage
  )
);

export const childSsnAtom = atomFamily((id) =>
  atomWithMmkvStorage(`child:${id}:ssn`, DEFAULT_SSN, SsnSchema, defaultStorage)
);

export const childUscisNumberAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:uscis-number`,
    DEFAULT_USCIS_NUMBER,
    UscisNumberSchema,
    defaultStorage
  )
);

export const childLivesInUsaAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:lives-in-uds`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);

export const childBirthCertificateAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `child:${id}:birth-certificate`,
    '',
    z.string(),
    defaultStorage
  )
);
