import { PDFCheckBox, PDFDocument, PDFTextField } from '@cantoo/pdf-lib';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { atom } from 'jotai';
import uuid from 'react-native-uuid';

import i589PdfTemplate from '@/assets/documents/i-589.pdf';
import { maritalStatusAtom, marriageDateAtom } from '@/lib/data/marriage';
import {
  spouseAlienNumberAtom, spouseEntriesAtom, spouseIsInUsaAtom, spouseLocationAtom,
  spouseNameAtom,
  spousePassportAtom,
  spouseSexAtom,
  spouseSsnAtom,
} from '@/lib/data/spouse';
import {
  alienNumberAtom,
  immigrationCourtStatusAtom,
  nameAtom,
  sexAtom,
  ssnAtom,
  uscisNumberAtom,
} from '@/lib/data/user';
import { prettifyDate, prettifyLocation } from '@/lib/data/utils';

const FIELD_PREFIX = 'form1[0].#subform';

const textFieldsAtom = atom<Record<string, string>>((get) => ({
  '[0].PtAILine1_ANumber[0]': get(alienNumberAtom),
  '[0].TextField1[0]': get(ssnAtom),
  '[0].TextField1[8]': get(uscisNumberAtom),

  '[0].PtAILine4_LastName[0]': get(nameAtom).last,
  '[0].PtAILine5_FirstName[0]': get(nameAtom).first,
  '[0].PtAILine6_MiddleName[0]': get(nameAtom).middle,
  '[0].TextField1[1]': 'alias',

  '[0].PtAILine8_AptNumber[0]': 'address line2',
  '[0].PtAILine8_AreaCode[0]': 'area code',
  '[0].PtAILine8_State[0]': 'state',
  '[0].PtAILine8_StreetNumandName[0]': 'address line1',
  '[0].PtAILine8_TelephoneNumber[0]': 'phone',
  '[0].PtAILine8_Zipcode[0]': 'zip',
  '[0].TextField1[2]': 'city',

  '[0].PtAILine9_AptNumber[0]': 'mailing address line2',
  '[0].PtAILine9_AreaCode[0]': 'mailing area code',
  '[0].PtAILine9_City[0]': 'mailing city',
  '[0].PtAILine9_InCareOf[0]': 'mailing name',
  '[0].PtAILine9_State[0]': 'mailing state',
  '[0].PtAILine9_StreetNumandName[0]': 'mailing address line1',
  '[0].PtAILine9_TelephoneNumbe[0]': 'mailing phone',
  '[0].PtAILine9_ZipCode[0]': 'mailing zip',

  '[0].DateTimeField1[0]': 'dob',
  '[0].TextField1[4]': 'birth location',

  '[0].TextField1[3]': 'current nationality',
  '[0].TextField1[5]': 'birth nationality',
  '[0].TextField1[6]': 'race',
  '[0].TextField1[7]': 'religion',

  '[0].DateTimeField6[0]': 'latest departure',
  '[0].TextField3[0]': 'I-94',

  '[0].DateTimeField2[0]': 'date 1',
  '[0].DateTimeField2[1]': 'status expiration',
  '[0].TextField4[0]': 'place 1',
  '[0].TextField4[1]': 'status 1',

  '[0].DateTimeField3[0]': 'date 2',
  '[0].TextField4[2]': 'place 2',
  '[0].TextField4[3]': 'status 2',

  '[0].DateTimeField4[0]': 'date 3',
  '[0].TextField4[4]': 'place 3',
  '[0].TextField4[5]': 'status 3',

  '[0].DateTimeField2[2]': 'passport expiration',
  '[0].TextField5[0]': 'passport country',
  '[0].TextField5[1]': 'passport number',
  '[0].TextField5[2]': '', // Travel document number

  '[0].TextField7[0]': 'language',
  '[0].TextField7[1]': 'other languages',

  ...(get(maritalStatusAtom) === 'married' ? {
    '[1].NotMarried[0].DateTimeField7[0]': 'spouse dob',
    '[1].NotMarried[0].PtAIILine1_ANumber[0]': get(spouseAlienNumberAtom),
    '[1].NotMarried[0].TextField10[1]': get(spousePassportAtom).number,
    '[1].NotMarried[0].TextField10[2]': get(spouseSsnAtom),

    '[1].NotMarried[0].PtAIILine5_LastName[0]': get(spouseNameAtom).last,
    '[1].NotMarried[0].PtAIILine6_FirstName[0]': get(spouseNameAtom).first,
    '[1].NotMarried[0].PtAIILine7_MiddleName[0]': get(spouseNameAtom).middle,
    '[1].NotMarried[0].TextField10[3]': 'spouse alias',

    '[1].NotMarried[0].DateTimeField8[0]': get(marriageDateAtom)?.toDateString(),
    '[1].NotMarried[0].TextField10[4]': 'marriage place',

    '[1].NotMarried[0].TextField10[5]': 'spouse birth location',

    '[1].NotMarried[0].TextField10[0]': 'spouse nationality',
    '[1].NotMarried[0].TextField10[6]': 'spouse race',

    ...(get(spouseIsInUsaAtom) ? {
      '[1].NotMarried[0].PtAIILine15_Specify[0]': prettifyLocation(get(spouseLocationAtom)),
    } : {
      '[1].NotMarried[0].PtAIILine16_PlaceofLastEntry[0]': get(spouseEntriesAtom)[0]?.port ?? '',
      '[1].NotMarried[0].PtAIILine17_DateofLastEntry[0]': prettifyDate(get(spouseEntriesAtom)[0]?.date ?? null),
      '[1].NotMarried[0].PtAIILine18_I94Number[0]': '', // spouse I-94
      '[1].NotMarried[0].PtAIILine19_StatusofLastAdmission[0]': get(spouseEntriesAtom)[0]?.status ?? '',
    })
  } : {})
}));

const checkboxsAtom = atom<Record<string, boolean>>((get) => ({
  '[0].CheckBox31[0]': false, // withholding of removal under convention against torture

  '[0].PartALine9Sex[0]': get(sexAtom) === 'male',
  '[0].PartALine9Sex[1]': get(sexAtom) === 'female',

  '[0].Marital[0]': get(maritalStatusAtom) === 'single',
  '[0].Marital[1]': get(maritalStatusAtom) === 'married',
  '[0].Marital[2]': get(maritalStatusAtom) === 'divorced',
  '[0].Marital[3]': get(maritalStatusAtom) === 'widowed',

  '[0].CheckBox3[0]': get(immigrationCourtStatusAtom) === 'never',
  '[0].CheckBox3[1]': get(immigrationCourtStatusAtom) === 'previously',
  '[0].CheckBox3[2]': get(immigrationCourtStatusAtom) === 'currently',

  '[0].CheckBox4[0]': false, // Fluent in english
  '[0].CheckBox4[1]': false, // Not fluent in english

  '[1].CheckBox5[0]': get(maritalStatusAtom) !== 'married',

  ...(get(maritalStatusAtom) === 'married' ? {
    '[1].NotMarried[0].CheckBox14_Sex[0]': get(spouseSexAtom) === 'male',
    '[1].NotMarried[0].CheckBox14_Sex[1]': get(spouseSexAtom) === 'female',

    ...(get(spouseIsInUsaAtom) ? {
      '[1].NotMarried[0].PtAIILine15_CheckBox15[1]': true, // spouse in US
    } : {
      '[1].NotMarried[0].PtAIILine15_CheckBox15[0]': true, // spouse outside US
    })
  } : {}),
}));

export const i589PdfAtom = atom(async (get) => {
  const [templateAsset] = await Asset.loadAsync(i589PdfTemplate);
  const { localUri } = await templateAsset!.downloadAsync();
  const templateContent = await FileSystem.readAsStringAsync(localUri!, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const document = await PDFDocument.load(templateContent, {
    password: '',
    updateMetadata: true,
  });

  const fields = document.getForm().getFields();
  const textFields = get(textFieldsAtom);
  const checkboxes = get(checkboxsAtom);

  for (const field of fields) {
    const name = field.getName().slice(FIELD_PREFIX.length);
    if (field instanceof PDFTextField) {
      field.setMaxLength(undefined);
      const content = textFields[name];
      field.setText((content ?? name) || 'FILLED');
    } else if (field instanceof PDFCheckBox) {
      const checked = checkboxes[name];
      if (checked === true) {
        field.check();
      } else if (checked === false) {
        field.uncheck();
      }
    }
  }

  const content = await document.saveAsBase64({
    updateFieldAppearances: true,
  });
  const path = `${FileSystem.cacheDirectory}${uuid.v4()}.pdf`;
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
});
