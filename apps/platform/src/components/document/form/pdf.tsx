'use client';

import { FileScanIcon, FilesIcon } from 'lucide-react';

import { PDFPreviewDialogContent } from '@/components/document/pdf-preview-dialog';
import { Button } from '@/components/ui/button';
import { LocalizedDatetime } from '@/components/ui/datetime';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  FormSection,
  FormSectionContent,
  FormSectionHeader,
  FormSectionTitle,
} from '@/components/ui/form-layout';
import { FileUpload } from '@/components/ui/input';
import { P } from '@/components/ui/typography';
import { useCurrentDocument } from '@/queries/document';
import {
  useDocumentPDFMetadata,
  useDocumentPDFUrl,
  useUploadDocumentPDF,
} from '@/queries/pdf';

export function PDFFormSection() {
  const document = useCurrentDocument();
  const pdfUrl = useDocumentPDFUrl(document.id);
  const pdfMetadata = useDocumentPDFMetadata(document.id);
  const { mutate: handleChangePdf } = useUploadDocumentPDF(document.id);

  return (
    <FormSection>
      <FormSectionHeader>
        <FormSectionTitle>PDF Configuration</FormSectionTitle>
      </FormSectionHeader>
      <FormSectionContent>
        {pdfMetadata ? (
          <P>
            Last updated by {pdfMetadata.ownerName ?? 'Unknown User'} on{' '}
            <LocalizedDatetime
              format={{
                calendar: 'gregory',
                dateStyle: 'short',
                timeStyle: 'short',
              }}
              local={true}
              value={pdfMetadata.updatedAt ?? undefined}
            />
          </P>
        ) : (
          <P>Upload a PDF to get started.</P>
        )}

        <div className='flex gap-4'>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!pdfUrl}>
                <FilesIcon /> Preview Current PDF
              </Button>
            </DialogTrigger>
            <PDFPreviewDialogContent src={pdfUrl}>
              PDF Preview: {document.name}
            </PDFPreviewDialogContent>
          </Dialog>

          <FileUpload onChange={handleChangePdf}>
            <FileScanIcon /> Upload New PDF
          </FileUpload>
        </div>
      </FormSectionContent>
    </FormSection>
  );
}
