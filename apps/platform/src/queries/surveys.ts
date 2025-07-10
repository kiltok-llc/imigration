import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import {
  InferInfiniteDataType,
  isomorphicSupabase,
} from '@/lib/supabase/utils';

export const surveysInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    getNextPageParam: (lastPage: { updatedAt: string }[]) =>
      lastPage.at(-1)?.updatedAt,
    initialPageParam: null,
    meta: {
      errorToast: 'Failed to load surveys',
    },
    async queryFn({ pageParam: updatedAt, signal }) {
      const client = await isomorphicSupabase();
      const query = client
        .from('surveys')
        .select(
          `
            id,
            name,
            description,
            updatedAt:updated_at,
            json
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
    queryKey: ['supabase', 'public', 'surveys', 'infinite'],
    select: (data) => data.pages.flat(),
  });

export type SurveysInfinite = InferInfiniteDataType<
  ReturnType<typeof surveysInfiniteQueryOptions>
>;

// for dev: hover to see type
let _: SurveysInfinite[number];

export const useInfiniteSurveys = () =>
  useSuspenseInfiniteQuery(surveysInfiniteQueryOptions());
