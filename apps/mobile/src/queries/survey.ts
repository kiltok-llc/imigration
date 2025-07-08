import { queryOptions } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';
import { InferDataType, supabaseQueryOptions } from '@/lib/supabase/utils';

export const surveyQueryOptions = (id: string) =>
  queryOptions({
    ...supabaseQueryOptions({
      query: () =>
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
    }),
    meta: {
      errorToast: 'Failed to load survey',
    },
  });

export type Survey = InferDataType<ReturnType<typeof surveyQueryOptions>>;

// for dev: hover to see type
let _: Survey;
