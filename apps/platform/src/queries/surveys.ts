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

export const surveysInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    ...supabaseInfiniteQueryOptions({
      getNextPageParam: (lastPage) => lastPage.at(-1)?.updatedAt,
      initialPageParam: null,
      query: (supabase: SupabaseClient<Database>) =>
        supabase
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
          .order('updated_at', { ascending: false })
          .limit(15),
      transformQuery: (query, datetime) =>
        datetime && query.lt('updated_at', datetime),
    }),
    meta: {
      errorToast: 'Failed to load surveys',
    },
    select: (data) => data.pages.flat(),
  });

export type SurveysInfinite = InferInfiniteDataType<
  ReturnType<typeof surveysInfiniteQueryOptions>
>;

// for dev: hover to see type
let _: SurveysInfinite[number];

export const useInfiniteSurveys = () =>
  useSuspenseInfiniteQuery(surveysInfiniteQueryOptions());
