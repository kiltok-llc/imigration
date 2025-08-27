import z from 'zod/v4';

import { DEFAULT_NAME } from '@/components/form/name';
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
import { userDataDocumentAtom } from '@/lib/data/utils';
import { ImmigrationCourtStatusEnum, SexEnum } from '@/lib/schemas';

export const spouseAlienNumberAtom = userDataDocumentAtom(
  'spouse:alienNumber',
  DEFAULT_ALIEN_NUMBER,
  AlienNumberSchema
);

export const spouseEntriesAtom = userDataDocumentAtom(
  'spouse:entries',
  [],
  z.array(UsaEntrySchema)
);

export const spouseStatusExpirationAtom = userDataDocumentAtom(
  'spouse:status-expiration',
  null,
  z.date().nullable()
);

export const spouseImmigrationCourtStatusAtom = userDataDocumentAtom(
  'spouse:immigration-court-status',
  null,
  ImmigrationCourtStatusEnum.nullable()
);

export const spouseNameAtom = userDataDocumentAtom(
  'spouse:name',
  DEFAULT_NAME,
  NameSchema
);

export const spousePassportAtom = userDataDocumentAtom(
  'spouse:passport',
  DEFAULT_PASSPORT,
  PassportSchema
);

export const spouseIsInUsaAtom = userDataDocumentAtom(
  'spouse:is-in-usa',
  null,
  z.boolean().nullable()
);

export const spouseLocationAtom = userDataDocumentAtom(
  'spouse:location',
  DEFAULT_LOCATION,
  LocationSchema
);

export const spouseSexAtom = userDataDocumentAtom(
  'spouse:sex',
  null,
  SexEnum.nullable()
);

export const spouseSsnAtom = userDataDocumentAtom(
  'spouse:ssn',
  DEFAULT_SSN,
  SsnSchema
);

export const spouseUscisNumberAtom = userDataDocumentAtom(
  'spouse:uscis-number',
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema
);
