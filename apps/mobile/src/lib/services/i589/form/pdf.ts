import { PDFDocument } from '@cantoo/pdf-lib';
import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import uuid from 'react-native-uuid';

import i589PdfTemplate from '@/assets/documents/i-589.pdf';
import { prettifyDate } from '@/lib/data/utils';
import { applicationFieldsAtom } from '@/lib/services/i589/form/application-fields';
import {
  Attachment,
  attachmentsAtom,
} from '@/lib/services/i589/form/attachments';
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

const SUPPLEMENT_A_TEMPLATE_PAGES = [10];
const SUPPLEMENT_B_TEMPLATE_PAGES = [11];

function fillPdf(document: PDFDocument, fields: PDFField[]) {
  const form = document.getForm();
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
  form.flatten();
}

async function fillPdfSupplement(
  document: PDFDocument,
  supplementPages: number[],
  supplementFields: PDFField[][]
) {
  for (const fields of supplementFields) {
    const donor = await PDFDocument.load(await document.save(), {
      password: '',
      updateMetadata: false,
    });

    fillPdf(donor, fields);
    donor.getForm().flatten();

    const pages = await document.copyPages(donor, supplementPages);
    for (const page of pages) {
      document.addPage(page);
    }
  }
}

function removePdfSupplementTemplatePages(
  document: PDFDocument,
  pages: number[][]
) {
  for (const page of [...new Set(pages.flat())].sort().toReversed()) {
    document.removePage(page);
  }
}

async function renderPdf(
  content: Uint8Array,
  fields: PDFField[],
  supplementAFields: PDFField[][],
  supplementBFields: PDFField[][],
  attachments: Attachment[]
) {
  // TODO workletize this

  // passing bytes to this seems to break the PDF renderer on iOS
  // so we load from base64 instead
  const document = await PDFDocument.load(content, {
    password: '',
    updateMetadata: false,
  });

  fillPdf(document, fields);

  await fillPdfSupplement(
    document,
    SUPPLEMENT_A_TEMPLATE_PAGES,
    supplementAFields
  );

  await fillPdfSupplement(
    document,
    SUPPLEMENT_B_TEMPLATE_PAGES,
    supplementBFields
  );

  removePdfSupplementTemplatePages(document, [
    SUPPLEMENT_A_TEMPLATE_PAGES,
    SUPPLEMENT_B_TEMPLATE_PAGES,
  ]);

  await renderPdfAttachments(document, attachments);

  return await document.save({
    updateFieldAppearances: true,
  });
}

async function renderPdfAttachments(
  document: PDFDocument,
  attachments: Attachment[]
) {
  const { height, width } = document.getPage(0).getSize();

  for (const attachment of attachments) {
    if (attachment instanceof File && attachment.type.startsWith('image/')) {
      const imageRef = await ImageManipulator.manipulate(
        attachment.uri
      ).renderAsync();
      const { base64 } = await imageRef.saveAsync({
        base64: true,
        format: SaveFormat.JPEG,
      });
      const pdfImage = await document.embedJpg(base64!);
      const page = document.addPage([width, height]);
      page.drawImage(pdfImage, pdfImage.scaleToFit(width, height));
      continue;
    }

    console.warn('Cannot render attachment!', attachment);
  }
}

export const i589PdfAtom = atomWithQuery((get) => ({
  queryFn: async () => {
    const fields = get(pdfFieldsAtom);
    const supplementAFields = get(supplementAFieldsAtom);
    const supplementBFields = get(supplementBFieldsAtom);
    const attachments = get(attachmentsAtom);

    const [{ localUri: assetUri } = {}] =
      await Asset.loadAsync(i589PdfTemplate);
    const assetContent = await new File(assetUri!).bytes();

    const content = await renderPdf(
      assetContent,
      fields,
      supplementAFields,
      supplementBFields,
      attachments
    );

    const file = new File(Paths.cache, `${uuid.v4()}.pdf`);
    file.write(content);
    return file.uri;
  },
  queryKey: ['pdf', 'i589'],
  staleTime: __DEV__ ? 0 : Infinity,
  throwOnError: true,
}));
