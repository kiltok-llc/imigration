import { queryOptions } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';
import { InferDataType, supabaseQueryOptions } from '@/lib/supabase/utils';

export const documentsQueryOptions = () =>
  queryOptions({
    ...supabaseQueryOptions({
      query: () =>
        supabase.from('documents').select(
          `
      id,
      name,
      description,
      updatedAt:updated_at,
      template
    `
        ),
      transform: (data) => data,
    }),
    meta: {
      errorToast: 'Failed to load documents',
    },
  });

export type Documents = InferDataType<ReturnType<typeof documentsQueryOptions>>;

// for dev: hover to see type
let _: Documents[number];
