import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { useSurveyId } from '@/lib/app-context';
import {
  InferDataType,
  isMissingError,
  isomorphicSupabase,
} from '@/lib/supabase/utils';

export const surveyQueryOptions = (id: string) =>
  queryOptions({
    meta: {
      errorToast: 'Failed to load survey',
    },
    async queryFn({ signal }) {
      const client = await isomorphicSupabase();
      const { data, error } = await client
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
        .eq('id', id)
        .single();

      if (data) {
        return data;
      }

      if (isMissingError(error)) {
        notFound();
      }

      throw error;
    },
    queryKey: ['supabase', 'public', 'surveys', id],
  });

export type Survey = InferDataType<ReturnType<typeof surveyQueryOptions>>;

// for dev: hover to see type
let _: Survey;

export const useCurrentSurvey = () =>
  useSuspenseQuery(surveyQueryOptions(useSurveyId())).data;
