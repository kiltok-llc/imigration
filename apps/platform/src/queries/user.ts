import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { useUserId } from '@/lib/app-context';
import {
  InferDataType,
  isomorphicSupabase,
  unwrap,
} from '@/lib/supabase/utils';

export const userQueryOptions = (id: string) =>
  queryOptions({
    meta: {
      errorToast: 'Failed to load user',
    },
    async queryFn({ signal }) {
      const client = await isomorphicSupabase();
      return await client
        .from('users')
        .select(
          `
      id,
      name,
      avatarUrl:avatar_url
    `
        )
        .abortSignal(signal)
        .eq('id', id)
        .single()
        .then(unwrap);
    },
    queryKey: ['supabase', 'public', 'users', id],
  });

export type CurrentUser = InferDataType<ReturnType<typeof userQueryOptions>>;

let _: CurrentUser;

export const useCurrentUser = () =>
  useSuspenseQuery(userQueryOptions(useUserId())).data;
