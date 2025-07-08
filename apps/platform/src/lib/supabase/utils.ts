import { Database } from '@repo/supabase/database.types';
import {
  PG_INVALID_TEXT_REPRESENTATION,
  PGRST_SINGULAR_RESPONSE_ITEM_COUNT_MISMATCH,
} from '@repo/supabase/error';
import { GenericSchema } from '@repo/supabase/generic';
import { isPostgrestTransformBuilder } from '@supabase-cache-helpers/postgrest-core';
import { encode as encodePostgrest } from '@supabase-cache-helpers/postgrest-react-query';
import { type StoragePrivacy } from '@supabase-cache-helpers/storage-core';
import {
  encode as encodeStorage,
  StorageFileApi,
} from '@supabase-cache-helpers/storage-react-query';
import {
  PostgrestBuilder,
  PostgrestFilterBuilder,
} from '@supabase/postgrest-js';
import { TransformOptions } from '@supabase/storage-js';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
  infiniteQueryOptions,
  queryOptions,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { createServerSupabase } from '@/lib/supabase/server';
import { raiseStatus } from '@/lib/utils';

export type InferDataType<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends UseQueryOptions<infer U, any, any, any> ? U : never;

export type InferInfiniteDataType<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends UseInfiniteQueryOptions<any, any, infer U, any, any> ? U : never;

export type QueryBuilder<T> = (client: SupabaseClient<Database>) => T;

export const isMissingError = (err: PostgrestError) => {
  return (
    err.code === PGRST_SINGULAR_RESPONSE_ITEM_COUNT_MISMATCH || // no rows found (or too many!)
    err.code === PG_INVALID_TEXT_REPRESENTATION // invalid uuid
  );
};

export const redirectMissing = (err: null | unknown) => {
  if (err === null) {
    console.debug('Not found (null error), redirecting...');
    notFound();
  }

  if (err instanceof PostgrestError && isMissingError(err)) {
    console.debug(`Not found (error code ${err.code}), redirecting...`);
    notFound();
  }

  throw err;
};

export const unwrap = <T>({
  data,
  error,
}: {
  data: null | T;
  error: unknown;
}): T => {
  if (data === null || error) {
    throw error;
  }
  return data;
};

export const unwrapSingle = <T>(data: null | T[]): T => {
  if (data === null || data.length === 0) {
    throw new Error('No data found');
  }
  if (data.length > 1) {
    throw new Error('Expected a single item, but found multiple');
  }
  return data[0]!;
};

export const isomorphicSupabase = async () =>
  // eslint-disable-next-line unicorn/prefer-global-this
  typeof window === 'undefined' ? await createServerSupabase() : supabase;

export const supabaseInfiniteQueryOptions = <
  TPageParam,
  SupabaseQueryData,
  TQueryFnData = SupabaseQueryData,
  Schema extends GenericSchema = GenericSchema,
  Row extends Record<string, unknown> = Record<string, unknown>,
>({
  query: queryBuilder,
  transform = (data) => data as unknown as TQueryFnData,
  transformError = (err) => {
    throw err;
  },
  transformQuery,
  ...options
}: {
  getNextPageParam: GetNextPageParamFunction<TPageParam, TQueryFnData>;
  getPreviousPageParam?: GetPreviousPageParamFunction<TPageParam, TQueryFnData>;
  initialPageParam: TPageParam;
  query: QueryBuilder<PostgrestFilterBuilder<Schema, Row, SupabaseQueryData>>;
  transform?: (data: SupabaseQueryData, pageParam: TPageParam) => TQueryFnData;
  transformError?: (err: unknown) => TQueryFnData;
  transformQuery?: (
    query: PostgrestFilterBuilder<Schema, Row, SupabaseQueryData>,
    pageParam: TPageParam
  ) => unknown;
}) =>
  infiniteQueryOptions({
    queryFn: async ({ pageParam, signal }) => {
      const client = await isomorphicSupabase();
      const query = queryBuilder(client).abortSignal(signal);
      if (transformQuery !== undefined) {
        transformQuery(query, pageParam as TPageParam);
      }

      let result;
      try {
        result = await query.throwOnError();
      } catch (error) {
        return transformError(error);
      }

      return transform(result.data, pageParam as TPageParam);
    },
    queryKey: encodePostgrest(queryBuilder(supabase), true),
    ...options,
  });

export const supabaseQueryOptions = <
  SupabaseQueryData,
  TData = SupabaseQueryData,
>({
  query: queryBuilder,
  transform,
  transformError = (err) => {
    throw err;
  },
}: {
  query: QueryBuilder<PostgrestBuilder<SupabaseQueryData>>;
  transform: (data: SupabaseQueryData) => TData; // it will not compile if this is optional
  transformError?: (err: unknown) => TData;
}) =>
  queryOptions({
    queryFn: async ({ signal }) => {
      const client = await isomorphicSupabase();
      const query = queryBuilder(client);

      if (isPostgrestTransformBuilder(query)) {
        query.abortSignal(signal);
      }

      let result;
      try {
        result = await query.throwOnError();
      } catch (error) {
        return transformError(error);
      }
      return transform(result.data);
    },
    queryKey: encodePostgrest(queryBuilder(supabase), false),
  });

export const supabaseFileDownloadQueryOptions = <
  Check extends boolean = false,
>({
  checkExists,
  file: fileBuilder,
  mode,
  path,
  transform,
}: {
  checkExists?: Check;
  file: QueryBuilder<StorageFileApi>;
  mode: StoragePrivacy;
  path: string;
  transform?: TransformOptions;
}) =>
  queryOptions({
    queryFn: async (): Promise<Check extends true ? Blob | null : Blob> => {
      const client = await isomorphicSupabase();
      const file = fileBuilder(client);

      if (checkExists) {
        const exists = await file.exists(path).then(unwrap);

        if (!exists) {
          return null as never;
        }
      }

      if (mode === 'private') {
        return await file
          .download(path, {
            transform,
          })
          .then(unwrap);
      }

      const {
        data: { publicUrl },
      } = file.getPublicUrl(path, { transform });
      return await fetch(publicUrl)
        .then(raiseStatus)
        .then((res) => res.blob());
    },
    queryKey: encodeStorage([fileBuilder(supabase), path]),
  });

export const supabaseFileUrlQueryOptions = <Check extends boolean = false>({
  checkExists,
  file: fileBuilder,
  mode,
  path,
  transform,
}: {
  checkExists?: Check;
  file: QueryBuilder<StorageFileApi>;
  mode: StoragePrivacy;
  path: string;
  transform?: TransformOptions;
}) =>
  queryOptions({
    queryFn: async (): Promise<Check extends true ? null | string : string> => {
      const client = await isomorphicSupabase();
      const file = fileBuilder(client);

      if (checkExists) {
        const exists = await file
          .exists(path)
          .then(unwrap)
          .catch((_) => false);

        if (!exists) {
          return null as never;
        }
      }

      if (mode === 'private') {
        return await file
          .createSignedUrl(path, 3600, { transform })
          .then(unwrap)
          .then(({ signedUrl }) => signedUrl);
      }

      const {
        data: { publicUrl },
      } = file.getPublicUrl(path, { transform });

      return publicUrl;
    },
    queryKey: encodeStorage([fileBuilder(supabase), path]),
  });
