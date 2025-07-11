import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { ChangeEvent } from 'react';

import { supabase } from '@/lib/supabase/client';
import {
  InferDataType,
  isomorphicSupabase,
  unwrap,
} from '@/lib/supabase/utils';

export const documentPDFUrlQueryOptions = (documentId: string) =>
  queryOptions({
    meta: {
      errorToast: 'Failed to retrieve PDF download URL',
    },
    queryFn: async () => {
      const client = await isomorphicSupabase();
      const bucket = client.storage.from('documents');
      const path = `${documentId}.pdf`;
      const exists = await bucket
        .info(path)
        .then(unwrap)
        .catch((_) => false);

      if (!exists) {
        return null;
      }

      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(path);
      return publicUrl;
    },
    queryKey: ['supabase', 'storage', 'documents', documentId, 'pdf', 'url'],
  });

export const useDocumentPDFUrl = (documentId: string) =>
  useSuspenseQuery(documentPDFUrlQueryOptions(documentId)).data;

export const documentPDFMetadataQueryOptions = (documentId: string) =>
  queryOptions({
    meta: {
      errorToast: 'Failed to load PDF metadata',
    },
    async queryFn({ signal }) {
      const client = await isomorphicSupabase();
      const { data: objectData } = await client
        .schema('storage')
        .from('objects')
        .select(
          `
        updatedAt:updated_at,
        ownerId:owner_id
        `
        )
        .abortSignal(signal)
        .eq('bucket_id', 'documents')
        .eq('name', `${documentId}.pdf`)
        .maybeSingle()
        .throwOnError();

      if (!objectData) {
        return null;
      }

      if (!objectData.ownerId) {
        return {
          ownerName: null,
          updatedAt: objectData.updatedAt,
        };
      }

      const { data: ownerData } = await client
        .from('users')
        .select('name')
        .eq('id', objectData.ownerId)
        .maybeSingle()
        .throwOnError();

      return {
        ownerName: ownerData?.name ?? null,
        updatedAt: objectData.updatedAt,
      };
    },
    queryKey: [
      'supabase',
      'storage',
      'documents',
      documentId,
      'pdf',
      'metadata',
    ],
  });

export const useUploadDocumentPDF = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      errorToast: 'Error uploading PDF',
      loadingToast: 'Uploading PDF...',
      successToast: 'PDF uploaded successfully',
    },
    async mutationFn(event: ChangeEvent<HTMLInputElement>) {
      return await supabase.storage
        .from('documents')
        .upload(`${documentId}.pdf`, event.target.files![0]!, {
          upsert: true,
        })
        .then(unwrap);
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ['supabase', 'storage', 'documents', documentId, 'pdf'],
      });
    },
  });
};

export type DocumentPDFMetadata = InferDataType<
  ReturnType<typeof documentPDFMetadataQueryOptions>
>;

export const useDocumentPDFMetadata = (documentId: string) =>
  useSuspenseQuery(documentPDFMetadataQueryOptions(documentId)).data;
