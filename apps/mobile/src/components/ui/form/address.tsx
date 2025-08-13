import { Lens } from '@hookform/lenses';
import { View } from 'react-native';
import tw from 'twrnc';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormTextInput } from '@/components/ui/form/text';

export const DEFAULT_ADDRESS = {
  city: '',
  state: '',
  street: '',
  unit: '',
  zipCode: '',
};

export const AddressSchema = z.object({
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  street: z.string().nonempty(),
  unit: z.string(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
});

export function FormAddressInput({
  lens,
}: {
  lens: Lens<z.input<typeof AddressSchema>>;
}) {
  return (
    <>
      <FormField {...lens.focus('street').interop()}>
        <FormTextInput
          autoComplete='address-line1'
          dense
          helperText={false}
          label={<Trans i18nKey='form.address.street' />}
        />
      </FormField>

      <FormField {...lens.focus('unit').interop()}>
        <FormTextInput
          autoComplete='address-line2'
          dense
          helperText={false}
          label={<Trans i18nKey='form.address.unit' />}
          optional
        />
      </FormField>

      <FormField {...lens.focus('city').interop()}>
        <FormTextInput
          dense
          helperText={false}
          label={<Trans i18nKey='form.address.city' />}
          textContentType='addressCity'
        />
      </FormField>

      <FormBlock style={tw`flex-row`}>
        <View style={tw`flex-1`}>
          <FormField {...lens.focus('state').interop()}>
            <FormTextInput
              dense
              helperText={false}
              label={<Trans i18nKey='form.address.state' />}
              textContentType='addressState'
            />
          </FormField>
        </View>

        <View style={tw`flex-1`}>
          <FormField {...lens.focus('zipCode').interop()}>
            <FormTextInput
              dense
              helperText={false}
              inputMode='numeric'
              label={<Trans i18nKey='form.address.zip-code' />}
              textContentType='postalCode'
            />
          </FormField>
        </View>
      </FormBlock>
    </>
  );
}
