import { atom } from 'jotai';

import { maritalStatusAtom } from '@/lib/data/marriage';
import {
  alienNumberAtom,
  entriesAtom,
  immigrationCourtStatusAtom,
  nameAtom,
  sexAtom,
  ssnAtom,
  statusExpirationAtom,
  uscisNumberAtom,
} from '@/lib/data/user';
import { PDFField } from '@/lib/services/i589/form/types';

export const a1Fields = atom<PDFField[]>((get) =>
  [
    ['CheckBox31[0]', false], // withholding of removal under convention against torture

    ['PtAILine1_ANumber[0]', get(alienNumberAtom)],
    ['TextField1[0]', get(ssnAtom)],
    ['TextField1[8]', get(uscisNumberAtom)],

    ['PtAILine4_LastName[0]', get(nameAtom).last],
    ['PtAILine5_FirstName[0]', get(nameAtom).first],
    ['PtAILine6_MiddleName[0]', get(nameAtom).middle],
    ['TextField1[1]', 'alias'],

    ['PtAILine8_StreetNumandName[0]', 'address line1'],
    ['PtAILine8_AptNumber[0]', 'address line2'],
    ['TextField1[2]', 'city'],
    ['PtAILine8_State[0]', 'state'],
    ['PtAILine8_Zipcode[0]', 'zip'],
    ['PtAILine8_AreaCode[0]', 'area code'],
    ['PtAILine8_TelephoneNumber[0]', 'phone'],

    ['PtAILine9_InCareOf[0]', 'mailing name'],
    ['PtAILine9_StreetNumandName[0]', 'mailing address line1'],
    ['PtAILine9_AptNumber[0]', 'mailing address line2'],
    ['PtAILine9_City[0]', 'mailing city'],
    ['PtAILine9_State[0]', 'mailing state'],
    ['PtAILine9_ZipCode[0]', 'mailing zip'],
    ['PtAILine9_AreaCode[0]', 'mailing area code'],
    ['PtAILine9_TelephoneNumbe[0]', 'mailing phone'],

    ['PartALine9Sex[0]', get(sexAtom) === 'male'],
    ['PartALine9Sex[1]', get(sexAtom) === 'female'],

    ['Marital[0]', get(maritalStatusAtom) === 'single'],
    ['Marital[1]', get(maritalStatusAtom) === 'married'],
    ['Marital[2]', get(maritalStatusAtom) === 'divorced'],
    ['Marital[3]', get(maritalStatusAtom) === 'widowed'],

    ['DateTimeField1[0]', 'dob'],
    ['TextField1[4]', 'birth location'],

    ['TextField1[3]', 'current nationality'],
    ['TextField1[5]', 'birth nationality'],
    ['TextField1[6]', 'race'],
    ['TextField1[7]', 'religion'],

    ['CheckBox3[0]', get(immigrationCourtStatusAtom) === 'never'],
    ['CheckBox3[1]', get(immigrationCourtStatusAtom) === 'previously'],
    ['CheckBox3[2]', get(immigrationCourtStatusAtom) === 'currently'],

    ['DateTimeField6[0]', 'latest departure'],
    ['TextField3[0]', 'I-94'],

    ['DateTimeField2[1]', get(statusExpirationAtom)],

    ...Array.from({ length: 3 }).flatMap((_, i) => [
      [`DateTimeField${i + 2}[0]`, get(entriesAtom)[i]?.date],
      [`TextField4[${i * 2}]`, get(entriesAtom)[i]?.port],
      [`TextField4[${i * 2 + 1}]`, get(entriesAtom)[i]?.status],
    ]),

    ['DateTimeField2[2]', 'passport expiration'],
    ['TextField5[0]', 'passport country'],
    ['TextField5[1]', 'passport number'],
    ['TextField5[2]', ''], // Travel document number

    ['TextField7[0]', 'language'],
    ['CheckBox4[0]', false], // Fluent in english
    ['CheckBox4[1]', false], // Not fluent in english
    ['TextField7[1]', 'other languages'],
  ].map(([k, v]) => [`form1[0].#subform[0].${k}`, v])
);
