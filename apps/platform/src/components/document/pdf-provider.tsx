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
import { isomorphicSupabase, unwrap } from '@/lib/supabase/utils';

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
  const { data: pdf } = useSuspenseQuery({
    meta: {
      errorToast: 'Failed to load PDF',
    },
    queryFn: async () => {
      const client = await isomorphicSupabase();
      const file = client.storage.from('documents');
      const path = `${documentId}.pdf`;

      const exists = await file
        .exists(path)
        .then(unwrap)
        .catch((error) => {
          // TODO should this be throwing error on file missing?
          console.debug('Error checking file existence:', error);
          return false;
        });

      if (!exists) {
        console.debug('File does not exist:', path);
        return null;
      }

      const blob = await file.download(path).then(unwrap);
      return await PDFDocument.load(await blob.arrayBuffer(), {
        password: '',
        updateMetadata: true,
      });
    },
    queryKey: [
      'supabase',
      'storage',
      'documents',
      documentId,
      'pdf',
      'document',
    ],
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
