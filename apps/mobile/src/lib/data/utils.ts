import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { LocationSchema, NameSchema } from '@/lib/data/schema';
import { userStorage } from '@/lib/mmkv';

export const userDataDocumentAtom = <T>(
  key: string,
  initialValue: T,
  schema: z.ZodType<T>
) => atomWithMmkvStorage<T>(key, initialValue, schema, userStorage);

export const userDataDocumentFamily = <T>(
  key: (id: string) => string,
  initialValue: T,
  schema: z.ZodType<T>
) =>
  atomFamily((id: string) =>
    atomWithMmkvStorage<T>(key(id), initialValue, schema, userStorage)
  );

export const prettifyLocation = ({
  city,
  country,
}: z.infer<typeof LocationSchema>) =>
  city && country ? `${city}, ${country}` : city || country || '';

export const prettifyDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    : '';

export const prettifyName = ({
  first,
  last,
  middle,
}: z.infer<typeof NameSchema>) =>
  [first, middle, last]
    .map((n) => n.trim())
    .filter(Boolean)
    .join(' ');
