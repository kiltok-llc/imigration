import { ComponentType, isValidElement, ReactElement, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import z from 'zod/v4';

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export function arraysEqual<T>(a: T[], b: T[]) {
  if (a.length !== b.length) {
    return false;
  }
  for (const [i, element] of a.entries()) {
    if (element !== b[i]) {
      return false;
    }
  }
  return true;
}

export function chunked<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Clears all MMKV keys that match the provided regular expression.
// @yields An array of groups captured by the regular expression for each cleared key.
export function* clearMMKVKeys<T extends string[]>(exp: RegExp, storage: MMKV) {
  const matches = storage
    .getAllKeys()
    .map((key) => key.match(exp))
    .filter((m) => !!m);

  for (const match of matches) {
    const [key, ...groups] = match;
    yield groups as T;
    console.debug(`Clearing storage key: ${key}`);
    storage.delete(key);
  }

  console.debug(`${matches.length} storage keys cleared`);
}

export function isElementOfType<P>(
  node: ReactNode,
  type: ComponentType<P>
): node is ReactElement<P> {
  return isValidElement(node) && node.type === type;
}

export async function raiseStatus<T extends Response>(res: T) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
  }
  return res;
}

export function required<T extends z.ZodTypeAny>(schema: T) {
  return schema.transform((val, ctx) => {
    if (val === null) {
      ctx.addIssue({
        code: 'invalid_type',
        expected: schema.def.type,
        fatal: true,
        input: val,
      });

      return z.NEVER;
    }

    return val;
  });
}

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function stringList<T extends z.ZodType<any, string[]>>(
  schema: T,
  sep: string = ','
) {
  return z
    .string()
    .transform((v) =>
      v
        .split(sep)
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .pipe(schema);
}

export function toI18nKey(name: string) {
  return name
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/.\d+/g, '')
    .toLowerCase();
}

export function toRouteId(routeName: string) {
  return routeName.replaceAll('/', '.');
}

export const growTo = <T>(
  array: T[],
  targetLength: number,
  fillValue: () => T
) => [
  ...array,
  ...Array.from({ length: targetLength - array.length }).map(() => fillValue()),
];

export const shrinkTo = <T>(array: T[], targetLength: number) =>
  array.slice(0, targetLength);

export const stretchTo = <T>(
  array: T[],
  targetLength: number,
  fillValue: () => T
) =>
  array.length < targetLength
    ? growTo(array, targetLength, fillValue)
    : shrinkTo(array, targetLength);
