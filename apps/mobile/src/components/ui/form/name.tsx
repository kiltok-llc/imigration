import { Lens } from '@hookform/lenses';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormField } from '@/components/ui/form/field';
import { FormTextInput } from '@/components/ui/form/text';

export const DEFAULT_NAME = {
  first: '',
  last: '',
  middle: '',
};

export const NameSchema = z.object({
  first: z.string().nonempty(),
  last: z.string().nonempty(),
  middle: z.string(),
});

export function FormNameInput({
  lens,
}: {
  lens: Lens<z.input<typeof NameSchema>>;
}) {
  return (
    <>
      <FormField {...lens.focus('first').interop()}>
        <FormTextInput
          autoComplete='given-name'
          dense
          helperText={false}
          label={<Trans i18nKey='form.name.first' />}
        />
      </FormField>

      <FormField {...lens.focus('middle').interop()}>
        <FormTextInput
          autoComplete='name-middle'
          dense
          helperText={false}
          label={<Trans i18nKey='form.name.middle' />}
          optional
        />
      </FormField>

      <FormField {...lens.focus('last').interop()}>
        <FormTextInput
          autoComplete='family-name'
          dense
          helperText={false}
          label={<Trans i18nKey='form.name.last' />}
        />
      </FormField>
    </>
  );
}
