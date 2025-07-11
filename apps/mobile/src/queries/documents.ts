import { queryOptions } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';
import { InferDataType } from '@/lib/supabase/utils';

export const documentsQueryOptions = () =>
  queryOptions({
    meta: {
      errorToast: 'Failed to load documents',
    },
    async queryFn({ signal }) {
      const { data } = await supabase
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
        .throwOnError();

      return data;
    },
    queryKey: ['supabase', 'public', 'documents'],
  });

export type Documents = InferDataType<ReturnType<typeof documentsQueryOptions>>;

// for dev: hover to see type
let _: Documents[number];
