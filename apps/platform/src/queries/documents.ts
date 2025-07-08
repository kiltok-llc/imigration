import { Database } from '@repo/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import {
  InferInfiniteDataType,
  supabaseInfiniteQueryOptions,
} from '@/lib/supabase/utils';

export const documentsInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    ...supabaseInfiniteQueryOptions({
      getNextPageParam: (lastPage) => lastPage.at(-1)?.updatedAt,
      initialPageParam: null,
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
          .order('updated_at', { ascending: false })
          .limit(15),
      transformQuery: (query, datetime) =>
        datetime && query.lt('updated_at', datetime),
    }),
    meta: {
      errorToast: 'Failed to load documents',
    },
    select: (data) => data.pages.flat(),
  });

export type DocumentsInfinite = InferInfiniteDataType<
  ReturnType<typeof documentsInfiniteQueryOptions>
>;

// for dev: hover to see type
let _: DocumentsInfinite[number];

export const useInfiniteDocuments = () =>
  useSuspenseInfiniteQuery(documentsInfiniteQueryOptions());
