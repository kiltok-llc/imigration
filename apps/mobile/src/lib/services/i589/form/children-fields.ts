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
import { PDFField } from '@/lib/services/i589/form/types';

export const childrenFieldsAtom = atom<PDFField[]>((get) => [
  ...(get(childIdsAtom).length === 0
    ? get(noChildrenFieldsAtom)
    : get(hasChildrenFieldsAtom)),

  ...get(childIdsAtom)
    .slice(0, 4)
    .flatMap((id, idx) => get(childFields({ id, idx }))),
]);

const noChildrenFieldsAtom = atom<PDFField[]>(() =>
  [
    ['ChildrenCheckbox[1]', true], // Does not have children
  ].map(([k, v]) => [`form1[0].#subform[1].${k}`, v])
);

const hasChildrenFieldsAtom = atom<PDFField[]>((get) =>
  [
    ['ChildrenCheckbox[0]', true], // Has children
    ['TotalChild[0]', get(childIdsAtom).length.toString()],
  ].map(([k, v]) => [`form1[0].#subform[1].${k}`, v])
);

const childFieldsFamily = (
  read: (id: string, idx: number, get: Getter) => PDFField[]
) =>
  atomFamily(
    ({ id, idx }: { id: string; idx: number }) =>
      atom<PDFField[]>((get) => read(id, idx, get)),
    isEqual
  );

const childFields = childFieldsFamily((id, idx, get) =>
  [
    [`ChildAlien${idx + 1}[0]`, get(childAlienNumberAtom(id))],
    [`ChildPassport${idx + 1}[0]`, get(childPassportAtom(id)).number],
    [`ChildMarital${idx + 1}[0]`, 'child marital status'],
    [`ChildSSN${idx + 1}[0]`, get(childSsnAtom(id))],

    [`ChildLast${idx + 1}[0]`, get(childNameAtom(id)).last],
    [`ChildFirst${idx + 1}[0]`, get(childNameAtom(id)).first],
    [`ChildMiddle${idx + 1}[0]`, get(childNameAtom(id)).middle],
    [`ChildDOB${idx + 1}[0]`, get(childDobAtom(id))],

    [`ChildCity${idx + 1}[0]`, 'child birth location'],
    [`ChildNat${idx + 1}[0]`, 'child nationality'],
    [`ChildRace${idx + 1}[0]`, get(childEthnicityAtom(id))],
    [
      `CheckBox${idx + 1}${idx ? 6 : 2}_Sex[0]`,
      get(childSexAtom(id)) === 'male',
    ],
    [
      `CheckBox${idx + 1}${idx ? 6 : 2}_Sex[1]`,
      get(childSexAtom(id)) === 'female',
    ],

    ...(get(childIsInUsaAtom(id))
      ? get(childInUsaFields({ id, idx }))
      : get(childNotInUsaFields({ id, idx }))),
  ].map(([k, v]) => [`form1[0].#subform[${idx ? 3 : 1}].${k}`, v])
);

const childNotInUsaFields = childFieldsFamily((_id, idx, _get) => [
  [`CheckBox${idx + 1}7[1]`, true],
  [
    `PtAIILine13_Specify${idx ? idx + 1 : ''}[0]`,
    'child location if outside us',
  ],
]);

const childInUsaFields = childFieldsFamily((id, idx, get) => [
  [`CheckBox${idx + 1}7[0]`, true], // is in USA

  [
    `PtAIILine14_PlaceofLastEntry${idx ? idx + 1 : ''}[0]`,
    get(childEntriesAtom(id))[0]?.port,
  ],
  [
    `PtAIILine15_${idx ? `DateofLastEntry${idx + 1}` : 'ExpirationDate'}[0]`,
    get(childEntriesAtom(id))[0]?.date,
  ],
  [`PtAIILine16_I94Number${idx ? idx + 1 : ''}[0]`, `I-94 ${id}`],
  [
    `PtAIILine17_StatusofLastAdmission${idx ? idx + 1 : ''}[0]`,
    get(childEntriesAtom(id))[0]?.status,
  ],

  [
    `PtAIILine18_${idx ? `ChildCurrentStatus${idx + 1}` : 'CurrentStatusofChild'}[0]`,
    '',
  ], // current status
  [
    `PtAIILine19_ExpDateofAuthorizedStay${idx ? idx + 1 : ''}[0]`,
    get(childStatusExpirationAtom(id)),
  ],
  [
    `PtAIILine20_Yes${idx ? idx + 1 : ''}[0]`,
    get(childImmigrationCourtStatusAtom(id)) === 'currently',
  ],
  [
    `PtAIILine20_No${idx ? idx + 1 : ''}[0]`,
    get(childImmigrationCourtStatusAtom(id)) !== 'currently',
  ],

  [`PtAIILine21_Yes${idx ? idx + 1 : ''}[0]`, true], // include in application
  [`PtAIILine21_No${idx ? idx + 1 : ''}[0]`, true], // do not include in application
]);
