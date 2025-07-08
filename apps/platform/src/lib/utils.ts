import { type ClassValue, clsx } from 'clsx';
import { formatHex } from 'culori';
import { ForwardedRef, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { Temporal } from 'temporal-polyfill';
import z from 'zod/v4';

export type Assign<T, U> = Omit<T, keyof U> & U;

export type StyledProps<T = object> = T & { className?: string };

export type StyledPropsWithChildren<T = object> = PropsWithChildren<
  StyledProps & T
>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toEpochMillis(timestamp: string) {
  return Temporal.Instant.from(timestamp).epochMilliseconds;
}

export const titleCase = (str: string, pattern: RegExp | string = ' ') =>
  str
    .toLowerCase()
    .split(pattern)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function cssHex(variable: string) {
  // eslint-disable-next-line unicorn/prefer-global-this
  if (typeof window === 'undefined') {
    return;
  }

  return formatHex(
    // eslint-disable-next-line unicorn/prefer-global-this
    window.getComputedStyle(document.body).getPropertyValue(variable)
  );
}

/**
 * Groups an array of objects by a specified key.
 * TODO es2023 has `Array.prototype.groupBy`
 *
 * @param array - The array to group.
 * @param key - The key to group by.
 */
export function groupBy<
  T extends Record<K, PropertyKey>, // ensure T[K] is a valid key
  K extends keyof T,
>(array: T[], key: K): Record<T[K], T[]> {
  return array.reduce(
    (acc, obj) => {
      const group = obj[key];

      (acc[group] ||= []).push(obj);
      return acc;
    },
    {} as Record<T[K], T[]>
  );
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanizeBytes(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${bytes.toFixed(dp)} ${units[u]}`;
}

export async function raiseStatus(res: Response) {
  if (!res.ok) {
    await res.text().then((text) => {
      throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
    });
  }
  return res;
}

export function reforwardRef<T>(ref: ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export function split<T extends object>(array: T[]) {
  return array.reduce(
    (acc, obj) => {
      for (const [key, value] of Object.entries(obj)) {
        (acc[key as keyof T] ||= []).push(value as T[keyof T]);
      }
      return acc;
    },
    {} as Record<keyof T, T[keyof T][]>
  );
}

export function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  return as.length <= bs.length
    ? (as.map((a, i) => [a, bs[i]]) as [A, B][])
    : (bs.map((b, i) => [as[i], b]) as [A, B][]);
}

export const stringToJSONSchema = z.string().transform((str, ctx): unknown => {
  try {
    return JSON.parse(str);
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
    return z.NEVER;
  }
});
