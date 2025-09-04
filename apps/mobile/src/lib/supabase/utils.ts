import {
  PG_INVALID_TEXT_REPRESENTATION,
  PGRST_SINGULAR_RESPONSE_ITEM_COUNT_MISMATCH,
} from '@repo/supabase/error';
import { GenericSchema } from '@repo/supabase/generic';
import { isPostgrestTransformBuilder } from '@supabase-cache-helpers/postgrest-core';
import { encode } from '@supabase-cache-helpers/postgrest-react-query';
import {
  PostgrestBuilder,
  PostgrestClientOptions,
  PostgrestFilterBuilder
} from '@supabase/postgrest-js';
import {
  AuthTokenResponsePassword,
  PostgrestError,
  User,
  UserResponse,
} from '@supabase/supabase-js';
import {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
  infiniteQueryOptions,
  queryOptions,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

export type InferDataType<T> =
  T extends UseQueryOptions<infer U, any, any, any> ? U : never;

export type InferInfiniteDataType<T> =
  T extends UseInfiniteQueryOptions<any, any, infer U, any, any> ? U : never;

export type QueryBuilder<T> = () => T;

export const isMissingError = (err: unknown) => {
  return (
    err instanceof PostgrestError &&
    (err.code === PGRST_SINGULAR_RESPONSE_ITEM_COUNT_MISMATCH || // no rows found (or too many!)
      err.code === PG_INVALID_TEXT_REPRESENTATION) // invalid uuid
  );
};

export const unwrapUser = ({ data, error }: UserResponse): { user: User } => {
  if (error) {
    throw error;
  }
  return data;
};

export const unwrapAuthTokenPassword = ({
  data,
  error,
}: AuthTokenResponsePassword) => {
  if (error) {
    throw error;
  }
  return data;
};

export const unwrapSignout = ({ error }: { error: Error | null }) => {
  if (error) {
    throw error;
  }
  return null;
};

export const supabaseInfiniteQueryOptions = <
  ClientOptions extends PostgrestClientOptions,
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
  query: QueryBuilder<PostgrestFilterBuilder<ClientOptions, Schema, Row, SupabaseQueryData>>;
  transform?: (data: SupabaseQueryData, pageParam: TPageParam) => TQueryFnData;
  transformError?: (err: unknown) => TQueryFnData;
  transformQuery?: (
    query: PostgrestFilterBuilder<ClientOptions, Schema, Row, SupabaseQueryData>,
    pageParam: TPageParam
  ) => unknown;
}) =>
  infiniteQueryOptions({
    queryFn: async ({ pageParam, signal }) => {
      const query = queryBuilder().abortSignal(signal);
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
    queryKey: encode(queryBuilder(), true),
    ...options,
  });

export const supabaseQueryOptions = <
  ClientOptions extends PostgrestClientOptions,
  SupabaseQueryData,
  TData = SupabaseQueryData,
>({
  query: queryBuilder,
  transform,
  transformError = (err) => {
    throw err;
  },
}: {
  query: QueryBuilder<PostgrestBuilder<ClientOptions, SupabaseQueryData>>;
  transform: (data: SupabaseQueryData) => TData; // it will not compile if this is optional
  transformError?: (err: unknown) => TData;
}) =>
  queryOptions({
    queryFn: async ({ signal }) => {
      const query = queryBuilder();
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
    queryKey: encode(queryBuilder(), false),
  });
