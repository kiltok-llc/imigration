import { isEqual } from '@ver0/deep-equal';
import { atom, Getter } from 'jotai';
import { atomFamily } from 'jotai/utils';

import {
  childAlienNumberAtom,
  childDobAtom,
  childEntriesAtom,
  childEthnicityAtom,
  childIdsAtom,
  childImmigrationCourtStatusAtom,
  childIsInUsaAtom,
  childNameAtom,
  childPassportAtom,
  childSexAtom,
  childSsnAtom,
  childStatusExpirationAtom,
} from '@/lib/data/child';
import { alienNumberAtom, nameAtom } from '@/lib/data/user';
import { prettifyName } from '@/lib/data/utils';
import { PDFField } from '@/lib/services/i589/form/types';
import { chunked } from '@/lib/utils';

export const supplementAFieldsAtom = atom<PDFField[][]>((get) =>
  chunked(get(childIdsAtom).slice(0, 4), 2).map((childIds) =>
    [
      ...get(headerFieldsAtom),

      ...childIds.flatMap((id, idx) => get(childFields({ id, idx }))),
    ].map(([k, v]) => [`form1[0].#subform[12].${k}`, v])
  )
);

const headerFieldsAtom = atom<PDFField[]>((get) => [
  ['PtAILine1_ANumber[1]', get(alienNumberAtom)],
  ['DateTimeField57[0]', new Date()],
  ['ApplicantName[0]', prettifyName(get(nameAtom))],
  ['TextField28[0]', 'signature'],
]);

const childFieldsFamily = (
  read: (id: string, idx: number, get: Getter) => PDFField[]
) =>
  atomFamily(
    ({ id, idx }: { id: string; idx: number }) =>
      atom<PDFField[]>((get) => read(id, idx, get)),
    isEqual
  );

const childFields = childFieldsFamily((id, idx, get) => [
  [`TextField12[${idx * 10 + 6}]`, get(childAlienNumberAtom(id))],
  [`TextField12[${idx * 10 + 7}]`, get(childPassportAtom(id)).number],
  [`TextField12[${idx * 10 + 8}]`, 'child marital status'],
  [`TextField12[${idx * 10 + 9}]`, get(childSsnAtom(id))],

  [`TextField12[${idx * 10}]`, get(childNameAtom(id)).last],
  [`TextField12[${idx * 10 + 2}]`, get(childNameAtom(id)).first],
  [`TextField12[${idx * 10 + 3}]`, get(childNameAtom(id)).middle ?? ''],
  [`DateTimeField14[${idx}]`, get(childDobAtom(id))],

  [`TextField12[${idx * 10 + 1}]`, 'child birth location'],
  [`TextField12[${idx * 10 + 4}]`, 'child nationality'],
  [`TextField12[${idx * 10 + 5}]`, get(childEthnicityAtom(id))],

  [
    idx === 0 ? 'CheckBox12_Sex[2]' : 'SuppAL12_CheckBox[0]',
    get(childSexAtom(id)) === 'male',
  ],
  [
    idx === 0 ? 'CheckBox12_Sex[3]' : 'SuppAL12_CheckBox[1]',
    get(childSexAtom(id)) === 'female',
  ],

  ...(get(childIsInUsaAtom(id))
    ? get(childInUsaFields({ id, idx }))
    : get(childNotInUsaFields({ id, idx }))),
]);

const childNotInUsaFields = childFieldsFamily((_id, idx, _get) => [
  [idx === 0 ? 'CheckBox57[1]' : 'SuppAL13_CheckBox[1]', true],
  [
    `SuppLALine13_Specify${idx === 0 ? '' : '2'}[0]`,
    'child location if outside us',
  ],
]);

const childInUsaFields = childFieldsFamily((id, idx, get) => [
  [idx === 0 ? 'CheckBox57[0]' : 'SuppAL13_CheckBox[0]', true], // is in USA

  [`ChildEntry${idx + 5}[0]`, get(childEntriesAtom(id))[0]?.port],
  [`ChildExp${idx + 5}[0]`, get(childEntriesAtom(id))[0]?.date],
  [`ChildINum${idx + 5}[0]`, `I-94 ${id}`],
  [`ChildStatus${idx + 5}[0]`, get(childEntriesAtom(id))[0]?.status],

  [`ChildCurrent${idx + 5}[0]`, 'current status'],

  [`ChildExpAuth${idx + 5}[0]`, get(childStatusExpirationAtom(id))],
  [
    idx === 0 ? 'SuppA_CheckBox20[0]' : 'SuppALine20_CheckBox2[0]',
    get(childImmigrationCourtStatusAtom(id)) === 'currently',
  ],
  [
    idx === 0 ? 'SuppA_CheckBox20[1]' : 'SuppALine20_CheckBox2[1]',
    get(childImmigrationCourtStatusAtom(id)) !== 'currently',
  ],

  [idx === 0 ? 'SuppA_CheckBox21[0]' : 'SuppALine21_CheckBox[0]', true], // include in application
  [idx === 0 ? 'SuppA_CheckBox21[1]' : 'SuppALine21_CheckBox[1]', false], // do not include in application
]);
