import { atom } from 'jotai';
import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { attachmentAtom } from '@/atoms/attachment-atom';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import {
  AddressSchema,
  AlienNumberSchema,
  DEFAULT_LOCATION,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  ImmigrationCourtStatusEnum,
  JobSchema,
  LocationSchema,
  NameSchema,
  PassportSchema,
  RangeSchema,
  SchoolInfoSchema,
  SexEnum,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';

export const entriesAtom = atomWithMMKVZod(
  'entries',
  [],
  z.array(UsaEntrySchema),
  defaultStorage
);

export const mostRecentEntryAtom = atom(
  (get) =>
    get(entriesAtom)
      .filter(({ date }) => date !== null)
      .sort(({ date: a }, { date: b }) => b!.getTime() - a!.getTime())[0]
);

export const firstEntryAtom = atom(
  (get) =>
    get(entriesAtom)
      .filter(({ date }) => date !== null)
      .sort(({ date: a }, { date: b }) => a!.getTime() - b!.getTime())[0]
);

export const alienNumberAtom = atomWithMMKVZod(
  'alien-number',
  '',
  AlienNumberSchema,
  defaultStorage
);

export const statusExpirationAtom = atomWithMMKVZod(
  'status-expiration',
  null,
  z.date().nullable(),
  defaultStorage
);

export const immigrationCourtStatusAtom = atomWithMMKVZod(
  'immigration-court-status',
  null,
  ImmigrationCourtStatusEnum.nullable(),
  defaultStorage
);

export const nameAtom = atomWithMMKVZod(
  'name',
  DEFAULT_FORM_NAME,
  NameSchema,
  defaultStorage
);

export const maidenNameAtom = atomWithMMKVZod(
  'maiden-name',
  '',
  z.string(),
  defaultStorage
);

export const otherNamesAtom = atomWithMMKVZod(
  'other-names',
  [],
  z.array(z.string()),
  defaultStorage
);

export const aliasesAtom = atomWithMMKVZod(
  'aliases',
  [],
  z.array(z.string()),
  defaultStorage
);

export const passportAtom = atomWithMMKVZod(
  'passport',
  DEFAULT_PASSPORT,
  PassportSchema,
  defaultStorage
);

export const addressesAtom = atomWithMMKVZod(
  'addresses',
  [],
  z.array(z.intersection(AddressSchema, RangeSchema)),
  defaultStorage
);

export const persecutionCountryAtom = atomWithMMKVZod(
  'persecution-country',
  '',
  z.string(),
  defaultStorage
);

const now = Date.now();
export const mostRecentInternalAddressAtom = atom((get) =>
  get(addressesAtom)
    .sort(
      ({ end: a }, { end: b }) => (b?.getTime() ?? now) - (a?.getTime() ?? now)
    )
    .find(({ country }) => country !== 'USA')
);

export const usaAddressAtom = atom((get) => get(addressesAtom)[0]);

export const mailingAddressAtom = atomWithMMKVZod(
  'mailing-address',
  null,
  AddressSchema.nullable(),
  defaultStorage
);

export const jobHistorySchema = atomWithMMKVZod(
  'job-history',
  [],
  z.array(JobSchema),
  defaultStorage
);

export const sexAtom = atomWithMMKVZod(
  'sex',
  null,
  SexEnum.nullable(),
  defaultStorage
);

export const nationalityAtom = atomWithMMKVZod(
  'nationality',
  '',
  z.string(),
  defaultStorage
);

export const ethnicityAtom = atomWithMMKVZod(
  'ethnicity',
  '',
  z.string(),
  defaultStorage
);

export const religionAtom = atomWithMMKVZod(
  'religion',
  '',
  z.string(),
  defaultStorage
);

export const birthNationalityAtom = atomWithMMKVZod(
  'birth-nationality',
  '',
  z.string(),
  defaultStorage
);

export const birthLocationAtom = atomWithMMKVZod(
  'birth-location',
  DEFAULT_LOCATION,
  LocationSchema,
  defaultStorage
);

export const birthCertificateAttachmentAtom =
  attachmentAtom('birth-certificate');

export const englishAtom = atomWithMMKVZod(
  'english',
  false,
  z.boolean(),
  defaultStorage
);

export const nativeLanguageAtom = atomWithMMKVZod(
  'native-language',
  { dialect: '', language: '' },
  z.object({
    dialect: z.string(),
    language: z.string(),
  }),
  defaultStorage
);

export const otherLanguagesAtom = atomWithMMKVZod(
  'other-languages',
  [],
  z.array(z.string()),
  defaultStorage
);

export const dobAtom = atomWithMMKVZod(
  'dob',
  null,
  z.date().nullable(),
  defaultStorage
);

export const ssnAtom = atomWithMMKVZod(
  'ssn',
  DEFAULT_SSN,
  SsnSchema,
  defaultStorage
);

export const uscisNumberAtom = atomWithMMKVZod(
  'uscis-number',
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema,
  defaultStorage
);

export const phoneNumberAtom = atomWithMMKVZod(
  'phone-number',
  '',
  z.string(),
  defaultStorage
);

export const schoolInfoAtom = atomWithMMKVZod(
  'school-info',
  [],
  z.array(SchoolInfoSchema),
  defaultStorage
);

export const emailAtom = atomWithMMKVZod(
  'email',
  '',
  z.string(),
  defaultStorage
);
