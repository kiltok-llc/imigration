import { Lens } from '@hookform/lenses';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormDateInput } from '@/components/ui/form/date';
import { FormField } from '@/components/ui/form/field';
import { required } from '@/lib/utils';

export const DEFAULT_RANGE = {
  end: null,
  start: null,
};

export const RangeSchema = z.object({
  end: required(z.date().nullable()),
  start: required(z.date().nullable()),
});

export const RangeSchemaWithOptionalEnd = z.object({
  end: z.date().nullable(),
  start: required(z.date().nullable()),
});

export function FormRangeInput({
  lens,
  optionalEnd = false,
}: {
  lens: Lens<z.input<typeof RangeSchema>>;
  optionalEnd?: boolean;
}) {
  return (
    <>
      <FormField {...lens.focus('start').interop()}>
        <FormDateInput label={<Trans i18nKey='form.range.start' />} />
      </FormField>

      <FormField {...lens.focus('end').interop()}>
        <FormDateInput
          label={<Trans i18nKey='form.range.end' />}
          optional={optionalEnd}
        />
      </FormField>
    </>
  );
}
