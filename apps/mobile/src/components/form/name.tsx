import { Lens } from '@hookform/lenses';
import z from 'zod/v4';

import { FormField } from '@/components/form/field';
import { FormTextInput } from '@/components/form/text';
import { Trans } from '@/components/trans';

export const DEFAULT_FORM_NAME = {
  first: '',
  last: '',
  middle: '',
};

export const FormNameSchema = z.object({
  first: z.string().nonempty(),
  last: z.string().nonempty(),
  middle: z.string(),
});

export function FormNameInput({
  lens,
}: {
  lens: Lens<z.input<typeof FormNameSchema>>;
}) {
  return (
    <>
      <FormField {...lens.focus('first').interop()}>
        <FormTextInput
          autoComplete='given-name'
          dense
          label={<Trans i18nKey='form.name.first' />}
        />
      </FormField>

      <FormField {...lens.focus('middle').interop()}>
        <FormTextInput
          autoComplete='name-middle'
          dense
          label={<Trans i18nKey='form.name.middle' />}
          optional
        />
      </FormField>

      <FormField {...lens.focus('last').interop()}>
        <FormTextInput
          autoComplete='family-name'
          dense
          label={<Trans i18nKey='form.name.last' />}
        />
      </FormField>
    </>
  );
}
