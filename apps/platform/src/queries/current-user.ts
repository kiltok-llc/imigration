import { Database } from '@repo/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { useUserId } from '@/lib/app-context';
import { InferDataType, supabaseQueryOptions } from '@/lib/supabase/utils';

export const currentUserQueryOptions = (id: string) =>
  queryOptions({
    ...supabaseQueryOptions({
      query: (supabase: SupabaseClient<Database>) =>
        supabase
          .from('users')
          .select(
            `
      id,
      name,
      avatarUrl:avatar_url
    `
          )
          .eq('id', id)
          .single(),
      transform: (data) => data,
    }),
    meta: {
      errorToast: 'Failed to load user',
    },
  });

export type CurrentUser = InferDataType<
  ReturnType<typeof currentUserQueryOptions>
>;

let _: CurrentUser;

export const useCurrentUser = () =>
  useSuspenseQuery(currentUserQueryOptions(useUserId())).data;
