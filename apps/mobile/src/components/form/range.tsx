import { Lens } from '@hookform/lenses';
import z from 'zod/v4';

import { FormDateInput } from '@/components/form/date';
import { FormField } from '@/components/form/field';
import { required } from '@/lib/utils';

export const FormRangeSchema = z.object({
  end: required(z.date().nullable()),
  start: required(z.date().nullable()),
});

export const FormRangeSchemaWithOptionalEnd = z.object({
  end: z.date().nullable(),
  start: required(z.date().nullable()),
});

export const DEFAULT_FORM_RANGE: z.input<typeof FormRangeSchema> = {
  end: null,
  start: null,
};

export const EXAMPLE_RANGE = {
  end: new Date('2023-01-01'),
  start: new Date('2022-01-01'),
};

export function FormRangeInput({
  lens,
  optionalEnd = false,
}: {
  lens: Lens<z.input<typeof FormRangeSchema>>;
  optionalEnd?: boolean;
}) {
  return (
    <>
      <FormField {...lens.focus('start').interop()}>
        <FormDateInput i18nKey='form.range.start' />
      </FormField>

      <FormField {...lens.focus('end').interop()}>
        <FormDateInput
          hint={optionalEnd ? 'optional' : undefined}
          i18nKey='form.range.end'
        />
      </FormField>
    </>
  );
}
