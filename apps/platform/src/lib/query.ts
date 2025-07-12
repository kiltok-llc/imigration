import { GenericSchema } from '@repo/supabase/generic';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { env } from '@/env';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: (_err) => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
      queries: {
        retry: env.NODE_ENV === 'development' ? false : 2,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
    mutationCache: new MutationCache({
      onError(error, _variables, _context, mutation) {
        console.error('Mutation Error', error);

        if (mutation.meta?.errorToast) {
          toast.error(mutation.meta.errorToast as string, {
            id: `mutation-${mutation.mutationId}`,
          });
        } else {
          toast.dismiss(`mutation-${mutation.mutationId}`);
        }
      },
      onMutate(_variables, mutation) {
        if (mutation.meta?.loadingToast) {
          toast.loading(mutation.meta.loadingToast as string, {
            id: `mutation-${mutation.mutationId}`,
          });
        }
      },
      onSuccess(_data, _variables, _context, mutation) {
        if (mutation.meta?.successToast) {
          toast.success(mutation.meta.successToast as string, {
            id: `mutation-${mutation.mutationId}`,
          });
        } else {
          toast.dismiss(`mutation-${mutation.mutationId}`);
        }
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error('Query Error', error, typeof error);

        if (typeof window !== 'undefined' && query.meta?.errorToast) {
          toast.error(query.meta.errorToast as string);
        }
      },
      onSuccess: (_data, query) => {
        if (typeof window !== 'undefined' && query.meta?.successToast) {
          toast.success(query.meta.successToast as string);
        }
      },
    }),
  });
}

export const unwrapQuery = async <
  Schema extends GenericSchema,
  Row extends Record<string, unknown>,
  Result,
  RelationName extends string,
  Relationships extends Record<string, GenericSchema>,
>(
  query: PostgrestFilterBuilder<
    Schema,
    Row,
    Result,
    RelationName,
    Relationships
  >
) => {
  const result = await query;
  return result.data;
};
