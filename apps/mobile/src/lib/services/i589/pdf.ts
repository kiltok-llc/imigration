import { PDFDocument } from '@cantoo/pdf-lib';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { atom } from 'jotai';
import uuid from 'react-native-uuid';

import i589PdfTemplate from '@/assets/documents/i-589.pdf';

export const i589PdfAtom = atom(async () => {
  const [templateAsset] = await Asset.loadAsync(i589PdfTemplate);
  const { localUri } = await templateAsset!.downloadAsync();
  const templateContent = await FileSystem.readAsStringAsync(localUri!, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const document = await PDFDocument.load(templateContent, {
    password: '',
    updateMetadata: true,
  });

  const content = await document.saveAsBase64({
    updateFieldAppearances: true,
  });
  const path = `${FileSystem.cacheDirectory}${uuid.v4()}.pdf`;
  console.log(path);
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
});
