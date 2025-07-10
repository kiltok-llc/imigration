import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { useDocumentId } from '@/lib/app-context';
import { GeneratedFieldsSchema } from '@/lib/schema/documents';
import { InferDataType, isomorphicSupabase } from '@/lib/supabase/utils';

export const documentQueryOptions = (id: string) =>
  queryOptions({
    meta: {
      errorToast: 'Failed to load document',
    },
    async queryFn({ signal }) {
      const client = await isomorphicSupabase();
      const { data } = await client
        .from('documents')
        .select(
          `
      id,
      name,
      description,
      updatedAt:updated_at,
      generatedFields:generated_fields
    `
        )
        .abortSignal(signal)
        .eq('id', id)
        .single()
        .throwOnError();

      return {
        ...data,
        generatedFields: GeneratedFieldsSchema.parse(data.generatedFields),
      };
    },
    queryKey: ['supabase', 'public', 'documents', id],
  });

export type Document = InferDataType<ReturnType<typeof documentQueryOptions>>;

// for dev: hover to see type
let _: Document;

export const useCurrentDocument = () =>
  useSuspenseQuery(documentQueryOptions(useDocumentId())).data;
