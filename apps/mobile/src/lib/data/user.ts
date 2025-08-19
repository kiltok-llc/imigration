import { focusAtom } from 'jotai-optics';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atoms/object-property-atom-family';
import {
  ImmigrationCourtStatusEnum,
  MaritalStatusEnum,
  SexEnum,
} from '@/lib/schema/common';

const AlienNumberSchema = z.string();

const UscisNumberSchema = z.string();

const SsnSchema = z.string();

const PassportSchema = z.object({
  country: z.string(),
  number: z.string(),
});

const NameSchema = z.object({
  first: z.string(),
  last: z.string(),
  middle: z.string(),
});

const ChildSchema = z
  .object({
    alienNumber: AlienNumberSchema,
    birthCertificate: z.string(),
    dob: z.date(),
    ethnicity: z.string(),
    immigrationCourtStatus: ImmigrationCourtStatusEnum,
    livesInUsa: z.boolean(),
    name: NameSchema,
    passport: PassportSchema,
    sex: SexEnum,
    ssn: SsnSchema,
    uscisNumber: UscisNumberSchema,
  })
  .partial();

const SiblingSchema = z
  .object({
    name: NameSchema,
    sex: SexEnum,
  })
  .partial();

const SpouseSchema = z
  .object({
    alienNumber: AlienNumberSchema,
    immigrationCourtStatus: ImmigrationCourtStatusEnum,
    name: NameSchema,
    passport: PassportSchema,
    sex: SexEnum,
    ssn: SsnSchema,
    uscisNumber: UscisNumberSchema,
  })
  .partial();

const ClientSchema = z
  .object({
    alienNumber: AlienNumberSchema,
    immigrationCourtStatus: ImmigrationCourtStatusEnum,
    name: NameSchema,
    passport: PassportSchema,
    sex: SexEnum,
    ssn: SsnSchema,
    uscisNumber: UscisNumberSchema,
  })
  .partial();

const MarriageSchema = z
  .object({
    certificate: z.string(),
    city: z.string(),
    country: z.string(),
    range: z.object({
      end: z.date().nullable(),
      start: z.date(),
    }),
  })
  .partial();

export const UserDataSchema = z
  .object({
    children: z.array(ChildSchema),
    client: ClientSchema,
    maritalStatus: MaritalStatusEnum,
    marriage: MarriageSchema,
    siblings: z.array(SiblingSchema),
    spouse: SpouseSchema,
  })
  .partial();

export type UserData = z.input<typeof UserDataSchema>;

export const userDataAtom = atomWithMmkvStorage('userData', {}, UserDataSchema);

export const userDataFamily = objectPropertyAtomFamily(userDataAtom);

export const numberOfChildrenAtom = focusAtom(userDataAtom, (optic) =>
  optic.prop('children').lens(
    (v) => v?.length ?? 0,
    (v, num: number) => {
      let children = v ?? [];
      children = children.slice(0, num);
      children = [
        ...children,
        ...Array.from({ length: num - children.length }, () => ({})),
      ];
      return children;
    }
  )
);

export const numberOfSiblingsAtom = focusAtom(userDataAtom, (optic) =>
  optic.prop('siblings').lens(
    (v) => v?.length ?? 0,
    (v, num: number) => {
      let siblings = v ?? [];
      siblings = siblings.slice(0, num);
      siblings = [
        ...siblings,
        ...Array.from({ length: num - siblings.length }, () => ({})),
      ];
      return siblings;
    }
  )
);
