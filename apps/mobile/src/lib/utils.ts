import z from 'zod/v4';

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

export async function raiseStatus<T extends Response>(res: T) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
  }
  return res;
}

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const nullableInput = <T extends z.ZodTypeAny>(
  schema: T,
) =>
  schema
    .nullable()
    .transform((val, ctx) => {
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
