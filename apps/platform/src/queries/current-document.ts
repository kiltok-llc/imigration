import { Database } from '@repo/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { useDocumentId } from '@/lib/app-context';
import {
  InferDataType,
  redirectMissing,
  supabaseQueryOptions,
} from '@/lib/supabase/utils';

export const currentDocumentQueryOptions = (id: string) =>
  queryOptions({
    ...supabaseQueryOptions({
      query: (supabase: SupabaseClient<Database>) =>
        supabase
          .from('documents')
          .select(
            `
      id,
      name,
      description,
      updatedAt:updated_at
    `
          )
          .eq('id', id)
          .single(),
      transform: (data) => data,
      transformError: redirectMissing,
    }),
    meta: {
      errorToast: 'Failed to load document',
    },
  });

export type CurrentDocument = InferDataType<
  ReturnType<typeof currentDocumentQueryOptions>
>;

// for dev: hover to see type
let _: CurrentDocument;

export const useCurrentDocument = () =>
  useSuspenseQuery(currentDocumentQueryOptions(useDocumentId())).data;
