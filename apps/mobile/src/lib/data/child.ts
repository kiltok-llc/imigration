import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { attachmentAtom } from '@/atoms/attachment-atom';
import {
  AddressSchema,
  AlienNumberSchema,
  DEFAULT_ADDRESS,
  DEFAULT_ALIEN_NUMBER,
  DEFAULT_NAME,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  ImmigrationCourtStatusEnum,
  NameSchema,
  PassportSchema,
  SexEnum,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';

export const childIdsAtom = atomWithMMKVZod(
  `child-ids`,
  [],
  z.array(z.uuid()),
  defaultStorage
);

export const childDobAtom = atomFamily((id) =>
  atomWithMMKVZod(`child:${id}:dob`, null, z.date().nullable(), defaultStorage)
);

export const childEthnicityAtom = atomFamily((id) =>
  atomWithMMKVZod(`child:${id}:ethnicity`, '', z.string(), defaultStorage)
);

export const childAlienNumberAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:alien-number`,
    DEFAULT_ALIEN_NUMBER,
    AlienNumberSchema,
    defaultStorage
  )
);

export const childEntriesAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:entries`,
    [],
    z.array(UsaEntrySchema),
    defaultStorage
  )
);

export const childStatusExpirationAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:status-expiration`,
    null,
    z.date().nullable(),
    defaultStorage
  )
);

export const childIsInUsaAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:is-in-usa`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);

export const childImmigrationCourtStatusAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:immigration-court-status`,
    null,
    ImmigrationCourtStatusEnum.nullable(),
    defaultStorage
  )
);

export const childNameAtom = atomFamily((id) =>
  atomWithMMKVZod(`child:${id}:name`, DEFAULT_NAME, NameSchema, defaultStorage)
);

export const childPassportAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:passport`,
    DEFAULT_PASSPORT,
    PassportSchema,
    defaultStorage
  )
);

export const childSexAtom = atomFamily((id) =>
  atomWithMMKVZod(`child:${id}:sex`, null, SexEnum.nullable(), defaultStorage)
);

export const childSsnAtom = atomFamily((id) =>
  atomWithMMKVZod(`child:${id}:ssn`, DEFAULT_SSN, SsnSchema, defaultStorage)
);

export const childUscisNumberAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:uscis-number`,
    DEFAULT_USCIS_NUMBER,
    UscisNumberSchema,
    defaultStorage
  )
);

export const childLivesInUsaAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:lives-in-uds`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);

export const childBirthCertificateAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:birth-certificate`,
    '',
    z.string(),
    defaultStorage
  )
);

export const childAddressAtom = atomFamily((id) =>
  atomWithMMKVZod(
    `child:${id}:address`,
    DEFAULT_ADDRESS,
    AddressSchema,
    defaultStorage
  )
);

export const childBirthCertificateAttachmentAtom = atomFamily((id) =>
  attachmentAtom(`child:${id}:birth-certificate`)
);
