'use client';

import { PDFDocument } from '@cantoo/pdf-lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FileWarningIcon } from 'lucide-react';
import { PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { BrandLoading } from '@/components/brand/logo';
import {
  EmptyContainer,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
import { ErrorFallback } from '@/components/ui/error';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { supabaseFileDownloadQueryOptions } from '@/lib/supabase/utils';

const DocumentPdfContext = createRequiredContext<PDFDocument>();

export const usePDF = () => useRequiredContext(DocumentPdfContext);

export function PDFProvider({
  children,
  documentId,
}: PropsWithChildren<{ documentId: string }>) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={console.warn}>
      <Suspense fallback={<BrandLoading />}>
        <PDFProviderInner documentId={documentId}>{children}</PDFProviderInner>
      </Suspense>
    </ErrorBoundary>
  );
}

function PDFMissing() {
  return (
    <EmptyContainer>
      <FileWarningIcon />

      <EmptyTitle>PDF not found</EmptyTitle>

      <EmptyDescription>Upload a PDF to get started.</EmptyDescription>
    </EmptyContainer>
  );
}

function PDFProviderInner({
  children,
  documentId,
}: PropsWithChildren<{ documentId: string }>) {
  const { data: blob } = useSuspenseQuery({
    ...supabaseFileDownloadQueryOptions({
      checkExists: true,
      file: (supabase) => supabase.storage.from('documents'),
      mode: 'private',
      path: `${documentId}.pdf`,
    }),
    meta: {
      errorToast: 'Failed to download PDF',
    },
  });

  const { data: pdf } = useSuspenseQuery({
    meta: {
      errorToast: 'Failed to load PDF',
    },
    queryFn: async () => {
      if (blob === null) {
        return null;
      }

      return await PDFDocument.load(await blob.arrayBuffer(), {
        password: '',
        updateMetadata: true,
      });
    },
    queryKey: ['pdf', 'documents', documentId],
  });

  if (!pdf) {
    return <PDFMissing />;
  }

  return (
    <DocumentPdfContext.Provider value={pdf}>
      {children}
    </DocumentPdfContext.Provider>
  );
}
