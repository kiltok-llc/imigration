import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { DEFAULT_FORM_NAME } from '@/components/form/name';
import {
  AddressSchema,
  DEFAULT_ADDRESS,
  DEFAULT_LOCATION,
  LocationSchema,
  NameSchema,
} from '@/lib/data/schema';
import { defaultStorage } from '@/lib/mmkv';

export const parentAliveAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `parent:${id}:alive`,
    null,
    z.boolean().nullable(),
    defaultStorage
  )
);

export const parentNameAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `parent:${id}:name`,
    DEFAULT_FORM_NAME,
    NameSchema,
    defaultStorage
  )
);

export const parentAddressAtom = atomFamily((id) =>
  atomWithMmkvStorage(
    `parent:${id}:address`,
    DEFAULT_ADDRESS,
    AddressSchema,
    defaultStorage
  )
);

export const parentBirthLocation = atomFamily((id) =>
  atomWithMmkvStorage(
    `parent:${id}:birth-location`,
    DEFAULT_LOCATION,
    LocationSchema,
    defaultStorage
  )
);
