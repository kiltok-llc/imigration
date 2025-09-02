import { atom } from 'jotai';

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

export const spouseFields = atom<PDFField[]>((get) =>
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
