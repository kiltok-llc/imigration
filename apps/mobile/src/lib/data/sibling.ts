import z from 'zod/v4';

import { DEFAULT_NAME } from '@/components/form/name';
import { NameSchema } from '@/lib/data/schema';
import { userDataDocumentAtom, userDataDocumentFamily } from '@/lib/data/utils';
import { SexEnum } from '@/lib/schema/common';

export const siblingIdsAtom = userDataDocumentAtom(
  `sibling-ids`,
  [],
  z.array(z.uuid())
);

export const siblingNameAtom = userDataDocumentFamily(
  (id) => `sibling:${id}:name`,
  DEFAULT_NAME,
  NameSchema
);

export const siblingSexAtom = userDataDocumentFamily(
  (id) => `sibling:${id}:sex`,
  null,
  SexEnum.nullable()
);

export const siblingDobAtom = userDataDocumentFamily(
  (id) => `sibling:${id}:dob`,
  null,
  z.date().nullable()
);

export const siblingLivesInUsaAtom = userDataDocumentFamily(
  (id) => `sibling:${id}:lives-in-usa`,
  null,
  z.boolean().nullable()
);
