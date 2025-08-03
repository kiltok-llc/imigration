import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { DEFAULT_LOCATION, LocationSchema } from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';
import { MaritalStatusEnum } from '@/lib/schemas';

export const maritalStatusAtom = atomWithMmkvStorage(
  'marital-status',
  null,
  MaritalStatusEnum.nullable(),
  defaultStorage
);

export const marriageCertificateAtom = atomWithMmkvStorage(
  'marriage-certificate',
  '',
  z.string(),
  defaultStorage
);

export const marriageLocationAtom = atomWithMmkvStorage(
  'marriage-location',
  DEFAULT_LOCATION,
  LocationSchema,
  defaultStorage
);

export const marriageDateAtom = atomWithMmkvStorage(
  'marriage-date',
  null,
  z.date().nullable(),
  defaultStorage
);

export const divorceDateAtom = atomWithMmkvStorage(
  'divorce-date',
  null,
  z.date().nullable(),
  defaultStorage
);
