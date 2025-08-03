import { isEqual } from '@ver0/deep-equal';
import { atom, Getter } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { siblingIdsAtom } from '@/lib/data/sibling';
import { PDFField } from '@/lib/services/i589/form/types';

export const backgroundFieldsAtom = atom<PDFField[]>((get) =>
  [
    ['TextField13[0]', 'previous address'],
    ['TextField13[2]', 'previous city'],
    ['TextField13[4]', 'previous state'],
    ['TextField13[6]', 'previous country'],
    ['DateTimeField21[0]', 'previous from'],
    ['DateTimeField20[0]', 'previous to'],

    ['TextField13[1]', 'persecution address'],
    ['TextField13[3]', 'persecution city'],
    ['TextField13[5]', 'persecution state'],
    ['TextField13[7]', 'persecution country'],
    ['DateTimeField22[0]', 'persecution from'],
    ['DateTimeField23[0]', 'persecution to'],

    ...get(residenceFieldsAtom),
    ...get(schoolFieldsAtom),
    ...get(employmentFieldsAtom),

    ['TextField13[46]', 'mother name'],
    ['TextField13[49]', 'mother birth location'],
    ['CheckBoxAIII5\\.m[0]', true], // mother deceased
    ['TextField35[0]', 'mother current location'],

    ['TextField13[47]', 'father name'],
    ['TextField13[50]', 'father birth location'],
    ['CheckBoxAIII5\\.f[0]', true], // father deceased
    ['TextField35[1]', 'father current location'],

    ...get(siblingsFieldsAtom),
  ].map(([k, v]) => [`form1[0].#subform[4].${k}`, v])
);

const residenceFieldsAtom = atom<PDFField[]>((_get) =>
  Array.from({ length: 5 }).flatMap((_, i) => [
    [`TextField13[${i < 2 ? i + 8 : i * 4 + 8}]`, `previous address ${i}`],
    [`TextField13[${i < 2 ? i + 10 : i * 4 + 9}]`, `previous city ${i}`],
    [`TextField13[${i < 2 ? i + 12 : i * 4 + 10}]`, `previous state ${i}`],
    [`TextField13[${i < 2 ? i + 14 : i * 4 + 11}]`, `previous country ${i}`],
    [`DateTimeField${i < 2 ? i + 24 : i * 2 + 24}[0]`, `previous from ${i}`],
    [`DateTimeField${i < 2 ? i + 26 : i * 2 + 25}[0]`, `previous to ${i}`],
  ])
);

const schoolFieldsAtom = atom<PDFField[]>((_get) =>
  Array.from({ length: 4 }).flatMap((_, i) => [
    [`TextField13[${i < 2 ? i + 28 : i * 3 + 28}]`, `school name ${i}`],
    [`TextField13[${i < 2 ? i + 30 : i * 3 + 29}]`, `school type ${i}`],
    [`TextField13[${i < 2 ? i + 32 : i * 3 + 30}]`, `school address ${i}`],
    [`DateTimeField${i < 2 ? 41 - i * 3 : 43 - i * 3}[0]`, `school from ${i}`],
    [`DateTimeField${i < 2 ? 40 - i : 38 - i}[0]`, `school to ${i}`],
  ])
);

const employmentFieldsAtom = atom<PDFField[]>((_get) =>
  Array.from({ length: 3 }).flatMap((_, i) => [
    [`TextField13[${i < 2 ? i + 40 : i + 42}]`, `employer name ${i}`],
    [`TextField13[${i < 2 ? i + 42 : i + 43}]`, `employer type ${i}`],
    [`DateTimeField${i < 2 ? i + 42 : i + 44}[0]`, `employer from ${i}`],
    [`DateTimeField${i < 2 ? i + 44 : i + 45}[0]`, `employer to ${i}`],
  ])
);

const siblingFieldsFamily = (
  read: (id: string, idx: number, get: Getter) => PDFField[]
) =>
  atomFamily(
    ({ id, idx }: { id: string; idx: number }) =>
      atom<PDFField[]>((get) => read(id, idx, get)),
    isEqual
  );

const siblingsFieldsAtom = atom<PDFField[]>((get) =>
  [...get(siblingIdsAtom), 'id1', 'id2', 'id3', 'id4']
    .slice(0, 4)
    .flatMap((id, idx) => get(siblingFields({ id, idx })))
);

const siblingFields = siblingFieldsFamily((_id, idx, _get) => [
  [`TextField13[${idx === 0 ? 48 : idx * 2 + 50}]`, `sibling ${idx} name`],
  [`TextField13[${idx * 2 + 51}]`, `sibling ${idx} birth location`],
  [`CheckBoxAIII5\\.s${idx + 1}[0]`, true], // sibling deceased
  [`TextField35[${idx + 2}]`, `sibling ${idx} current location`],
]);
