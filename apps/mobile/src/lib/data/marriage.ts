import z from 'zod/v4';

import { DEFAULT_LOCATION, LocationSchema } from '@/lib/data/schema';
import { userDataDocumentAtom } from '@/lib/data/utils';
import { MaritalStatusEnum } from '@/lib/schemas';

export const maritalStatusAtom = userDataDocumentAtom(
  'marital-status',
  null,
  MaritalStatusEnum.nullable()
);

export const marriageCertificateAtom = userDataDocumentAtom(
  'marriage-certificate',
  '',
  z.string()
);

export const marriageLocationAtom = userDataDocumentAtom(
  'marriage-location',
  DEFAULT_LOCATION,
  LocationSchema
);

export const marriageDateAtom = userDataDocumentAtom(
  'marriage-date',
  null,
  z.date().nullable()
);

export const divorceDateAtom = userDataDocumentAtom(
  'divorce-date',
  null,
  z.date().nullable()
);
