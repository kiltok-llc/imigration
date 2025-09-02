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
import { maritalStatusAtom, marriageDateAtom } from '@/lib/data/marriage';
import {
  spouseAlienNumberAtom,
  spouseEntriesAtom,
  spouseIsInUsaAtom,
  spouseLocationAtom,
  spouseNameAtom,
  spousePassportAtom,
  spouseSexAtom,
  spouseSsnAtom,
  spouseStatusExpirationAtom,
} from '@/lib/data/spouse';
import { prettifyLocation } from '@/lib/data/utils';
import { PDFField } from '@/lib/services/i589/form/types';

const childFieldsFamily = (
  read: (id: string, idx: number, get: Getter) => PDFField[]
) =>
  atomFamily(
    ({ id, idx }: { id: string; idx: number }) =>
      atom<PDFField[]>((get) => read(id, idx, get)),
    isEqual
  );

const marriageFields = atom<PDFField[]>((get) =>
  (get(maritalStatusAtom) === 'married'
    ? get(marriedFields)
    : get(notMarriedFields)
  ).map(([k, v]) => [`form1[0].#subform[1].${k}`, v])
);

const notMarriedFields = atom<PDFField[]>([
  ['CheckBox5[0]', true], // Not married
]);

const marriedFields = atom<PDFField[]>((get) =>
  [
    ['PtAIILine1_ANumber[0]', get(spouseAlienNumberAtom)],
    ['TextField10[1]', get(spousePassportAtom).number],
    ['DateTimeField7[0]', 'spouse dob'],
    ['TextField10[2]', get(spouseSsnAtom)],

    ['PtAIILine5_LastName[0]', get(spouseNameAtom).last],
    ['PtAIILine6_FirstName[0]', get(spouseNameAtom).first],
    ['PtAIILine7_MiddleName[0]', get(spouseNameAtom).middle],
    ['TextField10[3]', 'spouse alias'],

    ['DateTimeField8[0]', get(marriageDateAtom)],
    ['TextField10[4]', 'marriage place'],

    ['TextField10[5]', 'spouse birth location'],

    ['TextField10[0]', 'spouse nationality'],
    ['TextField10[6]', 'spouse race'],

    ['CheckBox14_Sex[0]', get(spouseSexAtom) === 'male'],
    ['CheckBox14_Sex[1]', get(spouseSexAtom) === 'female'],

    ...(get(spouseIsInUsaAtom)
      ? get(spouseInUsaFields)
      : get(spouseNotInUsaFields)),
  ].map(([k, v]) => [`NotMarried[0].${k}`, v])
);

const spouseNotInUsaFields = atom<PDFField[]>((get) => [
  ['PtAIILine15_CheckBox15[0]', true], // spouse outside US
  ['PtAIILine15_Specify[0]', prettifyLocation(get(spouseLocationAtom))],
]);

const spouseInUsaFields = atom<PDFField[]>((get) => [
  ['PtAIILine15_CheckBox15[1]', true], // spouse in US
  ['PtAIILine16_PlaceofLastEntry[0]', get(spouseEntriesAtom)[0]?.port],
  ['PtAIILine17_DateofLastEntry[0]', get(spouseEntriesAtom)[0]?.date],
  ['PtAIILine18_I94Number[0]', ''], // spouse I-94
  ['PtAIILine19_StatusofLastAdmission[0]', get(spouseEntriesAtom)[0]?.status],
  ['PtAIILine20_SpouseCurrentStatus[0]', ''], // current status
  ['PtAIILine21_ExpDateofAuthorizedStay[0]', get(spouseStatusExpirationAtom)],
  ['PtAIILine23_PreviousArrivalDate[0]', get(spouseEntriesAtom)[1]?.date],
]);

const noChildrenFields = atom<PDFField[]>(() =>
  [
    ['ChildrenCheckbox[1]', true], // Does not have children
  ].map(([k, v]) => [`form1[0].#subform[1].${k}`, v])
);

const hasChildrenFields = atom<PDFField[]>((get) =>
  [
    ['ChildrenCheckbox[0]', true], // Has children
    ['TotalChild[0]', get(childIdsAtom).length.toString()],
  ].map(([k, v]) => [`form1[0].#subform[1].${k}`, v])
);

const childrenFields = atom<PDFField[]>((get) => [
  ...(get(childIdsAtom).length === 0
    ? get(noChildrenFields)
    : get(hasChildrenFields)),

  ...get(childIdsAtom)
    .slice(0, 4)
    .flatMap((id, idx) => get(childFields({ id, idx }))),
]);

const childFields = childFieldsFamily((id, idx, get) =>
  [
    [`ChildAlien${idx + 1}[0]`, get(childAlienNumberAtom(id))],
    [`ChildPassport${idx + 1}[0]`, get(childPassportAtom(id)).number],
    [`ChildMarital${idx + 1}[0]`, ''], // child marital status
    [`ChildSSN${idx + 1}[0]`, get(childSsnAtom(id))],

    [`ChildLast${idx + 1}[0]`, get(childNameAtom(id)).last],
    [`ChildFirst${idx + 1}[0]`, get(childNameAtom(id)).first],
    [`ChildMiddle${idx + 1}[0]`, get(childNameAtom(id)).middle],
    [`ChildDOB${idx + 1}[0]`, get(childDobAtom(id))],

    [`ChildCity${idx + 1}[0]`, ''], // child birth location
    [`ChildNat${idx + 1}[0]`, ''], // child nationality
    [`ChildRace${idx + 1}[0]`, get(childEthnicityAtom(id))],
    [
      `CheckBox${idx + 1}${idx ? 6 : 2}_Sex[0]`,
      get(childSexAtom(id)) === 'male',
    ], // male
    [
      `CheckBox${idx + 1}${idx ? 6 : 2}_Sex[1]`,
      get(childSexAtom(id)) === 'female',
    ], // female

    ...(get(childIsInUsaAtom(id))
      ? get(childInUsaFields({ id, idx }))
      : get(childNotInUsaFields({ id, idx }))),
  ].map(([k, v]) => [`form1[0].#subform[${idx ? 3 : 1}].${k}`, v])
);

const childNotInUsaFields = childFieldsFamily((_id, idx, _get) => [
  [`CheckBox${idx + 1}7[1]`, true],
  [`PtAIILine13_Specify${idx ? idx + 1 : ''}[0]`, ''], // child location if outside us
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

export const a2Fields = atom<PDFField[]>((get) => [
  ...get(marriageFields),
  ...get(childrenFields),
]);
