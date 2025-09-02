import { PDFDocument } from '@cantoo/pdf-lib';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import uuid from 'react-native-uuid';

import i589PdfTemplate from '@/assets/documents/i-589.pdf';
import { prettifyDate } from '@/lib/data/utils';
import { applicationFields } from '@/lib/services/i589/form/application-fields';
import { backgroundFields } from '@/lib/services/i589/form/background-fields';
import { childrenFields } from '@/lib/services/i589/form/children-fields';
import { clientFields } from '@/lib/services/i589/form/client-fields';
import { hearingFields } from '@/lib/services/i589/form/hearing-fields';
import { interviewFields } from '@/lib/services/i589/form/interview-fields';
import { signatureFields } from '@/lib/services/i589/form/signature-fields';
import { spouseFields } from '@/lib/services/i589/form/spouse-fields';
import { PDFField } from '@/lib/services/i589/form/types';

const pdfFieldsAtom = atom<PDFField[]>((get) => [
  ...get(clientFields),
  ...get(spouseFields),
  ...get(childrenFields),
  ...get(backgroundFields),
  ...get(applicationFields),
  ...get(signatureFields),
  ...get(interviewFields),
  ...get(hearingFields),
]);

export const i589PdfAtom = atomWithQuery((get) => ({
  queryFn: async () => {
    const [templateAsset] = await Asset.loadAsync(i589PdfTemplate);
    const { localUri } = await templateAsset!.downloadAsync();
    const templateContent = await FileSystem.readAsStringAsync(localUri!, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const document = await PDFDocument.load(templateContent, {
      password: '',
      updateMetadata: true,
    });

    const form = document.getForm();
    const fields = get(pdfFieldsAtom);

    for (let [name, value] of fields) {
      if (value == null) {
        continue;
      }

      if (typeof value === 'boolean') {
        if (value) {
          form.getCheckBox(name).check();
        }
        continue;
      }

      if (value instanceof Date) {
        value = prettifyDate(value);
      }

      const textField = form.getTextField(name);
      textField.setMaxLength(undefined);
      textField.setText(value);
    }

    const content = await document.saveAsBase64({
      updateFieldAppearances: true,
    });
    const path = `${FileSystem.cacheDirectory}${uuid.v4()}.pdf`;
    await FileSystem.writeAsStringAsync(path, content, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return path;
  },
  queryKey: ['pdf', 'i589'],
  staleTime: __DEV__ ? 0 : Infinity,
  throwOnError: true,
}));
