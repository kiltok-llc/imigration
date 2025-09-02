import { PDFDocument } from '@cantoo/pdf-lib';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import uuid from 'react-native-uuid';

import i589PdfTemplate from '@/assets/documents/i-589.pdf';
import { prettifyDate } from '@/lib/data/utils';
import { a1Fields } from '@/lib/services/i589/form/a1';
import { a2Fields } from '@/lib/services/i589/form/a2';
import { a3Fields } from '@/lib/services/i589/form/a3';
import { PDFField } from '@/lib/services/i589/form/types';

const pdfFieldsAtom = atom<PDFField[]>((get) => [
  ...get(a1Fields),
  ...get(a2Fields),
  ...get(a3Fields),
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
