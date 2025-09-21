import { atom } from 'jotai';

import { maritalStatusAtom } from '@/lib/data/marriage';
import {
  addressesAtom,
  aliasesAtom,
  alienNumberAtom,
  birthLocationAtom,
  birthNationalityAtom,
  dobAtom,
  englishAtom,
  entriesAtom,
  ethnicityAtom,
  immigrationCourtStatusAtom,
  maidenNameAtom,
  mailingAddressAtom,
  nameAtom,
  nationalityAtom,
  nativeLanguageAtom,
  otherLanguagesAtom,
  otherNamesAtom,
  passportAtom, phoneNumberAtom,
  religionAtom,
  sexAtom,
  ssnAtom,
  statusExpirationAtom,
  uscisNumberAtom,
} from '@/lib/data/user';
import {
  prettifyLocation,
  prettifyName,
  prettifyNativeLanguage,
} from '@/lib/data/utils';
import { PDFField } from '@/lib/services/i589/form/types';

export const clientFieldsAtom = atom<PDFField[]>((get) =>
  [
    ['CheckBox31[0]', false], // withholding of removal under convention against torture

    ['PtAILine1_ANumber[0]', get(alienNumberAtom)],
    ['TextField1[0]', get(ssnAtom)],
    ['TextField1[8]', get(uscisNumberAtom)],

    ['PtAILine4_LastName[0]', get(nameAtom).last],
    ['PtAILine5_FirstName[0]', get(nameAtom).first],
    ['PtAILine6_MiddleName[0]', get(nameAtom).middle],
    [
      'TextField1[1]',
      [get(maidenNameAtom), ...get(otherNamesAtom), ...get(aliasesAtom)]
        .filter(Boolean)
        .join(', '),
    ],

    ['PtAILine8_StreetNumandName[0]', get(addressesAtom)[0]?.street],
    ['PtAILine8_AptNumber[0]', get(addressesAtom)[0]?.unit],
    ['TextField1[2]', get(addressesAtom)[0]?.city],
    ['PtAILine8_State[0]', get(addressesAtom)[0]?.state],
    ['PtAILine8_Zipcode[0]', get(addressesAtom)[0]?.zipCode],
    ['PtAILine8_AreaCode[0]', get(phoneNumberAtom).slice(4, 7)],
    ['PtAILine8_TelephoneNumber[0]', get(phoneNumberAtom).slice(9)],

    [
      'PtAILine9_InCareOf[0]',
      get(mailingAddressAtom) ? prettifyName(get(nameAtom)) : '',
    ],
    ['PtAILine9_StreetNumandName[0]', get(mailingAddressAtom)?.street ?? ''],
    ['PtAILine9_AptNumber[0]', get(mailingAddressAtom)?.unit ?? ''],
    ['PtAILine9_City[0]', get(mailingAddressAtom)?.city ?? ''],
    ['PtAILine9_State[0]', get(mailingAddressAtom)?.state ?? ''],
    ['PtAILine9_ZipCode[0]', get(mailingAddressAtom)?.zipCode ?? ''],
    ['PtAILine9_AreaCode[0]', get(phoneNumberAtom).slice(4, 7)],
    ['PtAILine9_TelephoneNumbe[0]', get(phoneNumberAtom).slice(9)],

    ['PartALine9Sex[0]', get(sexAtom) === 'male'],
    ['PartALine9Sex[1]', get(sexAtom) === 'female'],

    ['Marital[0]', get(maritalStatusAtom) === 'single'],
    ['Marital[1]', get(maritalStatusAtom) === 'married'],
    ['Marital[2]', get(maritalStatusAtom) === 'divorced'],
    ['Marital[3]', get(maritalStatusAtom) === 'widowed'],

    ['DateTimeField1[0]', get(dobAtom)],
    ['TextField1[4]', prettifyLocation(get(birthLocationAtom))],

    ['TextField1[3]', get(nationalityAtom)],
    ['TextField1[5]', get(birthNationalityAtom)],
    ['TextField1[6]', get(ethnicityAtom)],
    ['TextField1[7]', get(religionAtom)],

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

    ['DateTimeField2[2]', get(passportAtom).expiration],
    ['TextField5[0]', get(passportAtom).country],
    [
      'TextField5[1]',
      get(passportAtom).type === 'passport' ? get(passportAtom).number : '',
    ],
    [
      'TextField5[2]',
      get(passportAtom).type === 'other' ? get(passportAtom).number : '',
    ], // Travel document number

    ['TextField7[0]', prettifyNativeLanguage(get(nativeLanguageAtom))],
    ['CheckBox4[0]', get(englishAtom)], // Fluent in english
    ['CheckBox4[1]', !get(englishAtom)], // Not fluent in english
    ['TextField7[1]', get(otherLanguagesAtom).join(', ')],
  ].map(([k, v]) => [`form1[0].#subform[0].${k}`, v])
);
