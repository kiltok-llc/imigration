import z from 'zod/v4';

import { DEFAULT_NAME } from '@/components/form/name';
import {
  AlienNumberSchema,
  DEFAULT_PASSPORT,
  DEFAULT_SSN,
  DEFAULT_USCIS_NUMBER,
  NameSchema,
  PassportSchema,
  SsnSchema,
  UsaEntrySchema,
  UscisNumberSchema,
} from '@/lib/data/schema';
import { userDataDocumentAtom } from '@/lib/data/utils';
import { ImmigrationCourtStatusEnum, SexEnum } from '@/lib/schema/common';

export const alienNumberAtom = userDataDocumentAtom(
  'alien-number',
  '',
  AlienNumberSchema
);

export const entriesAtom = userDataDocumentAtom(
  'entries',
  [],
  z.array(UsaEntrySchema)
);

export const statusExpirationAtom = userDataDocumentAtom(
  'status-expiration',
  null,
  z.date().nullable()
);

export const immigrationCourtStatusAtom = userDataDocumentAtom(
  'immigration-court-status',
  null,
  ImmigrationCourtStatusEnum.nullable()
);

export const nameAtom = userDataDocumentAtom('name', DEFAULT_NAME, NameSchema);

export const passportAtom = userDataDocumentAtom(
  'passport',
  DEFAULT_PASSPORT,
  PassportSchema
);

export const sexAtom = userDataDocumentAtom('sex', null, SexEnum.nullable());

export const ssnAtom = userDataDocumentAtom('ssn', DEFAULT_SSN, SsnSchema);

export const uscisNumberAtom = userDataDocumentAtom(
  'uscis-number',
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema
);
