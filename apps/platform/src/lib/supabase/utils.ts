import { Database } from '@repo/supabase/database.types';
import {
  PG_INVALID_TEXT_REPRESENTATION,
  PGRST_SINGULAR_RESPONSE_ITEM_COUNT_MISMATCH,
} from '@repo/supabase/error';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { createServerSupabase } from '@/lib/supabase/server';

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

export const unwrapValue = <T>(data: null | T): T => {
  if (data === null) {
    throw new Error('No data found');
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
  typeof window === 'undefined' ? await createServerSupabase() : supabase;
