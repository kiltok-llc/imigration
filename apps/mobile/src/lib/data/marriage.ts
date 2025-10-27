import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import {
  DEFAULT_LOCATION,
  LocationSchema,
  MaritalStatusEnum,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';

export const maritalStatusAtom = atomWithMMKVZod(
  'marital-status',
  null,
  MaritalStatusEnum.nullable(),
  defaultStorage
);

export const marriageCertificateAtom = atomWithMMKVZod(
  'marriage-certificate',
  '',
  z.string(),
  defaultStorage
);

export const marriageLocationAtom = atomWithMMKVZod(
  'marriage-location',
  DEFAULT_LOCATION,
  LocationSchema,
  defaultStorage
);

export const marriageDateAtom = atomWithMMKVZod(
  'marriage-date',
  null,
  z.date().nullable(),
  defaultStorage
);

export const divorceDateAtom = atomWithMMKVZod(
  'divorce-date',
  null,
  z.date().nullable(),
  defaultStorage
);
