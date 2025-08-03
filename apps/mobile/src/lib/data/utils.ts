import z from 'zod/v4';

import {
  LocationSchema,
  NameSchema,
  NativeLanguageSchema,
} from '@/lib/data/schema';

export const prettifyLocation = ({
  city,
  country,
}: z.infer<typeof LocationSchema>) =>
  city && country ? `${city}, ${country}` : city || country || '';

export const prettifyNativeLanguage = ({
  dialect,
  language,
}: z.infer<typeof NativeLanguageSchema>) =>
  dialect ? `${language} (${dialect})` : language;

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
