import z from 'zod/v4';

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
import { userDataDocumentAtom, userDataDocumentFamily } from '@/lib/data/utils';
import { ImmigrationCourtStatusEnum, SexEnum } from '@/lib/schema/common';

export const childIdsAtom = userDataDocumentAtom(
  `child-ids`,
  [],
  z.array(z.uuid())
);

export const childDobAtom = userDataDocumentFamily(
  (id) => `child:${id}:dob`,
  null,
  z.date().nullable()
);

export const childEthnicityAtom = userDataDocumentFamily(
  (id) => `child:${id}:ethnicity`,
  '',
  z.string()
);

export const childAlienNumberAtom = userDataDocumentFamily(
  (id) => `child:${id}:alien-number`,
  DEFAULT_ALIEN_NUMBER,
  AlienNumberSchema
);

export const childEntriesAtom = userDataDocumentFamily(
  (id) => `child:${id}:entries`,
  [],
  z.array(UsaEntrySchema)
);

export const childStatusExpirationAtom = userDataDocumentFamily(
  (id) => `child:${id}:status-expiration`,
  null,
  z.date().nullable()
);

export const childImmigrationCourtStatusAtom = userDataDocumentFamily(
  (id) => `child:${id}:immigration-court-status`,
  null,
  ImmigrationCourtStatusEnum.nullable()
);

export const childNameAtom = userDataDocumentFamily(
  (id) => `child:${id}:name`,
  DEFAULT_NAME,
  NameSchema
);

export const childPassportAtom = userDataDocumentFamily(
  (id) => `child:${id}:passport`,
  DEFAULT_PASSPORT,
  PassportSchema
);

export const childSexAtom = userDataDocumentFamily(
  (id) => `child:${id}:sex`,
  null,
  SexEnum.nullable()
);

export const childSsnAtom = userDataDocumentFamily(
  (id) => `child:${id}:ssn`,
  DEFAULT_SSN,
  SsnSchema
);

export const childUscisNumberAtom = userDataDocumentFamily(
  (id) => `child:${id}:uscis-number`,
  DEFAULT_USCIS_NUMBER,
  UscisNumberSchema
);

export const childLivesInUsaAtom = userDataDocumentFamily(
  (id) => `child:${id}:lives-in-uds`,
  null,
  z.boolean().nullable()
);

export const childBirthCertificateAtom = userDataDocumentFamily(
  (id) => `child:${id}:birth-certificate`,
  '',
  z.string()
);
