import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import {
  InferInfiniteDataType,
  isomorphicSupabase,
} from '@/lib/supabase/utils';

export const documentsInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    getNextPageParam: (lastPage: { updatedAt: string }[]) =>
      lastPage.at(-1)?.updatedAt,
    initialPageParam: null,
    meta: {
      errorToast: 'Failed to load documents',
    },
    async queryFn({ pageParam: updatedAt, signal }) {
      const client = await isomorphicSupabase();
      const query = client
        .from('documents')
        .select(
          `
            id,
            name,
            description,
            updatedAt:updated_at
            `
        )
        .abortSignal(signal)
        .order('updated_at', { ascending: false })
        .limit(15);

      if (updatedAt) {
        query.lt('updated_at', updatedAt);
      }

      const { data } = await query.throwOnError();
      return data;
    },
    queryKey: ['supabase', 'public', 'documents', 'infinite'],
    select: (data) => data.pages.flat(),
  });

export type DocumentsInfinite = InferInfiniteDataType<
  ReturnType<typeof documentsInfiniteQueryOptions>
>;

// for dev: hover to see type
let _: DocumentsInfinite[number];

export const useInfiniteDocuments = () =>
  useSuspenseInfiniteQuery(documentsInfiniteQueryOptions());
