'use client';

import { useUpload } from '@supabase-cache-helpers/storage-react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileScanIcon } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { LocalizedDatetime } from '@/components/ui/datetime';
import {
  FormSection,
  FormSectionContent,
  FormSectionHeader,
  FormSectionSubtitle,
  FormSectionTitle,
} from '@/components/ui/form-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { P } from '@/components/ui/typography';
import { supabase } from '@/lib/supabase/client';
import {
  supabaseFileUrlQueryOptions,
  supabaseQueryOptions,
  unwrap,
  unwrapSingle,
} from '@/lib/supabase/utils';
import { useCurrentDocument } from '@/queries/current-document';

export function PDFFormSection() {
  const document = useCurrentDocument();

  return (
    <FormSection>
      <FormSectionHeader>
        <FormSectionTitle>PDF Configuration</FormSectionTitle>
        <FormSectionSubtitle></FormSectionSubtitle>
      </FormSectionHeader>
      <FormSectionContent>
        <PDFLastUpdated documentId={document.id} />
        <div className='flex gap-4'>
          <PDFPreviewButton documentId={document.id} />
          <PDFUploadButton documentId={document.id} />
        </div>
      </FormSectionContent>
    </FormSection>
  );
}

function PDFLastUpdated({ documentId }: { documentId: string }) {
  const { data: pdfMeta } = useQuery({
    ...supabaseQueryOptions({
      query: (supabase) =>
        supabase
          .schema('storage')
          .from('objects')
          .select(
            `
        updatedAt:updated_at,
        ownerId:owner_id
        `
          )
          .eq('bucket_id', 'documents')
          .eq('name', `${documentId}.pdf`)
          .maybeSingle(),
      transform: (data) =>
        data && {
          ownerId: data.ownerId!,
          updatedAt: data.updatedAt!,
        },
    }),
    meta: {
      errorToast: 'Failed to load PDF metadata',
    },
  });

  const updatedAt = pdfMeta?.updatedAt;
  const ownerId = pdfMeta?.ownerId;

  const { data: pdfOwner } = useQuery({
    enabled: !!ownerId,
    ...supabaseQueryOptions({
      query: (supabase) =>
        supabase.from('users').select('name').eq('id', ownerId!).maybeSingle(),
      transform: (data) => data,
    }),
    meta: {
      errorToast: 'Failed to load PDF owner data',
    },
  });

  const pdfOwnerName = pdfOwner?.name;

  if (pdfMeta === null) {
    return <P>Upload a PDF to get started.</P>;
  }

  if (!updatedAt || !pdfOwnerName) {
    return <Skeleton size='label' />;
  }

  return (
    <P>
      Last updated by {pdfOwnerName} on{' '}
      <LocalizedDatetime
        format={{
          calendar: 'gregory',
          dateStyle: 'short',
          timeStyle: 'short',
        }}
        local={true}
        value={updatedAt}
      />
    </P>
  );
}

function PDFPreviewButton({ documentId }: { documentId: string }) {
  const { data: url } = useQuery({
    ...supabaseFileUrlQueryOptions({
      checkExists: true,
      file: (supabase) => supabase.storage.from('documents'),
      mode: 'private',
      path: `${documentId}.pdf`,
    }),
    meta: {
      errorToast: 'Failed to retrieve PDF download URL',
    },
  });

  return (
    <Button disabled={!url} onClick={() => window.open(url!)}>
      Preview Current PDF
    </Button>
  );
}

function PDFUploadButton({ documentId }: { documentId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutateAsync: handleUploadPdf } = useUpload(
    supabase.storage.from('documents'),
    {
      throwOnError: true,
      upsert: true,
    }
  );

  const { mutateAsync: handleChangePdf } = useMutation({
    meta: {
      errorToast: 'Error uploading PDF',
      loadingToast: 'Uploading PDF...',
      successToast: 'PDF uploaded successfully',
    },
    async mutationFn(event: ChangeEvent<HTMLInputElement>) {
      return await handleUploadPdf({
        files: [
          {
            data: event.target.files![0]!,
            name: `${documentId}.pdf`,
            type: 'application/pdf',
          },
        ],
      })
        .then(unwrapSingle)
        .then(unwrap);
    },
    onSuccess() {
      // Invalidate storage schema queries to refresh the PDF metadata
      void queryClient.invalidateQueries({
        queryKey: ['postgrest', 'null', 'storage'],
      });
    },
  });

  return (
    <Button
      onClick={() => {
        fileInputRef.current?.click();
      }}
    >
      <FileScanIcon /> Upload New PDF
      <input
        accept='application/pdf'
        className='hidden'
        onChange={handleChangePdf}
        ref={fileInputRef}
        type='file'
      />
    </Button>
  );
}
