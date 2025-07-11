import { queryOptions } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';
import { InferDataType } from '@/lib/supabase/utils';

export const surveyQueryOptions = (id: string) =>
  queryOptions({
    meta: {
      errorToast: 'Failed to load survey',
    },
    async queryFn({ signal }) {
      const { data } = await supabase
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
        .single()
        .throwOnError();

      return data;
    },
    queryKey: ['supabase', 'public', 'survey', id],
  });

export type Survey = InferDataType<ReturnType<typeof surveyQueryOptions>>;

// for dev: hover to see type
let _: Survey;
