import { Database } from '@repo/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { useSurveyId } from '@/lib/app-context';
import {
  InferDataType,
  redirectMissing,
  supabaseQueryOptions,
} from '@/lib/supabase/utils';

export const currentSurveyQueryOptions = (id: string) =>
  queryOptions({
    ...supabaseQueryOptions({
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
          .eq('id', id)
          .single(),
      transform: (data) => data,
      transformError: redirectMissing,
    }),
    meta: {
      errorToast: 'Failed to load survey',
    },
  });

export type CurrentSurvey = InferDataType<
  ReturnType<typeof currentSurveyQueryOptions>
>;

// for dev: hover to see type
let _: CurrentSurvey;

export const useCurrentSurvey = () =>
  useSuspenseQuery(currentSurveyQueryOptions(useSurveyId())).data;
