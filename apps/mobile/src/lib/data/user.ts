import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { attachmentAtom } from '@/atoms/attachment-atom';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import {
  AddressSchema,
  AlienNumberSchema,
  DEFAULT_LOCATION,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  JobSchema,
  LocationSchema,
  NameSchema,
  PassportSchema,
  RangeSchema,
  SchoolInfoSchema,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';
import { ImmigrationCourtStatusEnum, SexEnum } from '@/lib/schemas';

export const entriesAtom = atomWithMmkvStorage(
  'entries',
  [],
  z.array(UsaEntrySchema),
  defaultStorage
);

export const alienNumberAtom = atomWithMmkvStorage(
  'alien-number',
  '',
  AlienNumberSchema,
  defaultStorage
);

export const statusExpirationAtom = atomWithMmkvStorage(
  'status-expiration',
  null,
  z.date().nullable(),
  defaultStorage
);

export const immigrationCourtStatusAtom = atomWithMmkvStorage(
  'immigration-court-status',
  null,
  ImmigrationCourtStatusEnum.nullable(),
  defaultStorage
);

export const nameAtom = atomWithMmkvStorage(
  'name',
  DEFAULT_FORM_NAME,
  NameSchema,
  defaultStorage
);

export const maidenNameAtom = atomWithMmkvStorage(
  'maiden-name',
  '',
  z.string(),
  defaultStorage
);

export const otherNamesAtom = atomWithMmkvStorage(
  'other-names',
  [],
  z.array(z.string()),
  defaultStorage
);

export const aliasesAtom = atomWithMmkvStorage(
  'aliases',
  [],
  z.array(z.string()),
  defaultStorage
);

export const passportAtom = atomWithMmkvStorage(
  'passport',
  DEFAULT_PASSPORT,
  PassportSchema,
  defaultStorage
);

export const addressesAtom = atomWithMmkvStorage(
  'addresses',
  [],
  z.array(z.intersection(AddressSchema, RangeSchema)),
  defaultStorage
);

export const mailingAddressAtom = atomWithMmkvStorage(
  'mailing-address',
  null,
  AddressSchema.nullable(),
  defaultStorage
);

export const jobHistorySchema = atomWithMmkvStorage(
  'job-history',
  [],
  z.array(JobSchema),
  defaultStorage
);

export const sexAtom = atomWithMmkvStorage(
  'sex',
  null,
  SexEnum.nullable(),
  defaultStorage
);

export const nationalityAtom = atomWithMmkvStorage(
  'nationality',
  '',
  z.string(),
  defaultStorage
);

export const ethnicityAtom = atomWithMmkvStorage(
  'ethnicity',
  '',
  z.string(),
  defaultStorage
);

export const religionAtom = atomWithMmkvStorage(
  'religion',
  '',
  z.string(),
  defaultStorage
);

export const birthNationalityAtom = atomWithMmkvStorage(
  'birth-nationality',
  '',
  z.string(),
  defaultStorage
);

export const birthLocationAtom = atomWithMmkvStorage(
  'birth-location',
  DEFAULT_LOCATION,
  LocationSchema,
  defaultStorage
);

export const birthCertificateAttachmentAtom =
  attachmentAtom('birth-certificate');

export const englishAtom = atomWithMmkvStorage(
  'english',
  false,
  z.boolean(),
  defaultStorage
);

export const nativeLanguageAtom = atomWithMmkvStorage(
  'native-language',
  { dialect: '', language: '' },
  z.object({
    dialect: z.string(),
    language: z.string(),
  }),
  defaultStorage
);

export const otherLanguagesAtom = atomWithMmkvStorage(
  'other-languages',
  [],
  z.array(z.string()),
  defaultStorage
);

export const dobAtom = atomWithMmkvStorage(
  'dob',
  null,
  z.date().nullable(),
  defaultStorage
);

export const ssnAtom = atomWithMmkvStorage(
  'ssn',
  DEFAULT_SSN,
  SsnSchema,
  defaultStorage
);

export const uscisNumberAtom = atomWithMmkvStorage(
  'uscis-number',
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema,
  defaultStorage
);

export const phoneNumberAtom = atomWithMmkvStorage(
  'phone-number',
  '',
  z.string(),
  defaultStorage
);

export const schoolInfoAtom = atomWithMmkvStorage(
  'school-info',
  [],
  z.array(SchoolInfoSchema),
  defaultStorage
);

export const emailAtom = atomWithMmkvStorage(
  'email',
  '',
  z.string(),
  defaultStorage
);
