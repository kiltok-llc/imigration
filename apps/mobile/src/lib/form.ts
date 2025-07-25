import { UseFormReturn } from 'react-hook-form';
import z from 'zod/v4';

export type ZodFormContext<T extends z.ZodType> = UseFormReturn<
  // @ts-expect-error TODO zod v4 update broke this type
  z.input<T>,
  unknown,
  z.output<T>
>;
