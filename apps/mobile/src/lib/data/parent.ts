import z from 'zod/v4';

import { DEFAULT_FORM_NAME } from '@/components/form/name';
import {
  AddressSchema,
  DEFAULT_ADDRESS,
  DEFAULT_LOCATION,
  LocationSchema,
  NameSchema,
} from '@/lib/data/schema';
import { userDataDocumentFamily } from '@/lib/data/utils';

export const parentAliveAtom = userDataDocumentFamily(
  (id) => `parent:${id}:alive`,
  null,
  z.boolean().nullable()
);

export const parentNameAtom = userDataDocumentFamily(
  (id) => `parent:${id}:name`,
  DEFAULT_FORM_NAME,
  NameSchema
);

export const parentAddressAtom = userDataDocumentFamily(
  (id) => `parent:${id}:address`,
  DEFAULT_ADDRESS,
  AddressSchema
);

export const parentBirthLocation = userDataDocumentFamily(
  (id) => `parent:${id}:birth-location`,
  DEFAULT_LOCATION,
  LocationSchema
);
