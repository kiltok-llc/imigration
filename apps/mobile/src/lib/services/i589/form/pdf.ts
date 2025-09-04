import { PDFDocument, PDFForm } from '@cantoo/pdf-lib';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import uuid from 'react-native-uuid';

import i589PdfTemplate from '@/assets/documents/i-589.pdf';
import { prettifyDate } from '@/lib/data/utils';
import { applicationFieldsAtom } from '@/lib/services/i589/form/application-fields';
import { backgroundFieldsAtom } from '@/lib/services/i589/form/background-fields';
import { childrenFieldsAtom } from '@/lib/services/i589/form/children-fields';
import { clientFieldsAtom } from '@/lib/services/i589/form/client-fields';
import { hearingFieldsAtom } from '@/lib/services/i589/form/hearing-fields';
import { interviewFieldsAtom } from '@/lib/services/i589/form/interview-fields';
import { signatureFieldsAtom } from '@/lib/services/i589/form/signature-fields';
import { spouseFieldsAtom } from '@/lib/services/i589/form/spouse-fields';
import { supplementAFieldsAtom } from '@/lib/services/i589/form/supplement-a';
import { supplementBFieldsAtom } from '@/lib/services/i589/form/supplement-b';
import { PDFField } from '@/lib/services/i589/form/types';

const pdfFieldsAtom = atom<PDFField[]>((get) => [
  ...get(clientFieldsAtom),
  ...get(spouseFieldsAtom),
  ...get(childrenFieldsAtom),
  ...get(backgroundFieldsAtom),
  ...get(applicationFieldsAtom),
  ...get(signatureFieldsAtom),
  ...get(interviewFieldsAtom),
  ...get(hearingFieldsAtom),
]);

const SUPPLEMENT_A_PAGES = [10];
const SUPPLEMENT_B_PAGES = [11];

// Extract groups of pages from document into separate document
async function extractPdfSupplements(src: PDFDocument, groups: number[][]) {
  const documents: PDFDocument[] = [];

  for (const indicies of groups) {
    // This could maybe be concurrent with Promise.all for a small speedup, but
    // pdf-lib should be tested to see if it can handle that first.

    const document = await PDFDocument.create();
    const pages = await document.copyPages(src, indicies);
    for (const page of pages) {
      document.addPage(page);
    }

    documents.push(document);
  }

  for (const page of groups.flat().sort().toReversed()) {
    src.removePage(page);
  }

  return documents;
}

function fillPdfForm(form: PDFForm, fields: PDFField[]) {
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
}

async function fillPdfSupplement(
  document: PDFDocument,
  supplement: PDFDocument,
  supplementFields: PDFField[][]
) {
  for (const fields of supplementFields) {
    const form = supplement.getForm();
    fillPdfForm(form, fields);
    form.flatten();
    const pages = await document.copyPages(
      supplement,
      supplement.getPageIndices()
    );
    for (const page of pages) {
      document.addPage(page);
    }
  }
}

async function loadPdfAsset(assetId: number) {
  const [asset] = await Asset.loadAsync(assetId);
  const { localUri } = await asset!.downloadAsync();
  const content = await FileSystem.readAsStringAsync(localUri!, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return await PDFDocument.load(content, {
    password: '',
    updateMetadata: true,
  });
}

async function savePdfDocument(document: PDFDocument) {
  const content = await document.saveAsBase64({
    updateFieldAppearances: true,
  });
  const path = `${FileSystem.cacheDirectory}${uuid.v4()}.pdf`;
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
}

export const i589PdfAtom = atomWithQuery((get) => ({
  queryFn: async () => {
    const document = await loadPdfAsset(i589PdfTemplate);

    const [supplementA, supplementB] = await extractPdfSupplements(document, [
      SUPPLEMENT_A_PAGES,
      SUPPLEMENT_B_PAGES,
    ]);

    const supplementAFields = get(supplementAFieldsAtom);
    await fillPdfSupplement(document, supplementA!, supplementAFields);

    const supplementBFields = get(supplementBFieldsAtom);
    await fillPdfSupplement(document, supplementB!, supplementBFields);

    const form = document.getForm();
    const fields = get(pdfFieldsAtom);
    fillPdfForm(form, fields);

    return await savePdfDocument(document);
  },
  queryKey: ['pdf', 'i589'],
  staleTime: __DEV__ ? 0 : Infinity,
  throwOnError: true,
}));
