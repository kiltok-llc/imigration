import { Lens } from '@hookform/lenses';
import { View } from 'react-native';
import tw from 'twrnc';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormTextInput } from '@/components/form/text';

export const DEFAULT_FORM_ADDRESS = {
  city: '',
  state: '',
  street: '',
  unit: '',
  zipCode: '',
};

export const DEFAULT_FORM_ADDRESS_WITH_COUNTRY = {
  ...DEFAULT_FORM_ADDRESS,
  country: '',
};

export const DEFAULT_FORM_SHORT_ADDRESS = {
  city: '',
  country: '',
};

export const FormAddressSchema = z.object({
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  street: z.string().nonempty(),
  unit: z.string(),
  zipCode: z.string().nonempty(),
});

export const FormAddressWithCountrySchema = FormAddressSchema.extend({
  country: z.string().nonempty(),
});

export const FormShortAddressSchema = z.object({
  city: z.string().nonempty(),
  country: z.string().nonempty(),
});

export function FormAddressInput({
  lens,
}: {
  lens: Lens<z.input<typeof FormAddressSchema>>;
}) {
  return (
    <>
      <FormField {...lens.focus('street').interop()}>
        <FormTextInput
          autoComplete='address-line1'
          dense
          i18nKey='form.address.street'
        />
      </FormField>

      <FormField {...lens.focus('unit').interop()}>
        <FormTextInput
          autoComplete='address-line2'
          dense
          hint='optional'
          i18nKey='form.address.unit'
        />
      </FormField>

      <FormField {...lens.focus('city').interop()}>
        <FormTextInput
          dense
          i18nKey='form.address.city'
          textContentType='addressCity'
        />
      </FormField>

      <FormBlock style={tw`flex-row`}>
        <View style={tw`flex-1`}>
          <FormField {...lens.focus('state').interop()}>
            <FormTextInput
              dense
              i18nKey='form.address.state'
              textContentType='addressState'
            />
          </FormField>
        </View>

        <View style={tw`flex-1`}>
          <FormField {...lens.focus('zipCode').interop()}>
            <FormTextInput
              dense
              i18nKey='form.address.zip-code'
              inputMode='numeric'
              textContentType='postalCode'
            />
          </FormField>
        </View>
      </FormBlock>
    </>
  );
}

export function FormAddressWithCountryInput({
  lens,
}: {
  lens: Lens<z.input<typeof FormAddressWithCountrySchema>>;
}) {
  return (
    <>
      <FormAddressInput lens={lens.reflect(({ country, ...rest }) => rest)} />

      <FormField {...lens.focus('country').interop()}>
        <FormTextInput
          dense
          i18nKey='form.address.country'
          textContentType='countryName'
        />
      </FormField>
    </>
  );
}

export function FormShortAddressInput({
  lens,
}: {
  lens: Lens<z.input<typeof FormShortAddressSchema>>;
}) {
  return (
    <>
      <FormField {...lens.focus('city').interop()}>
        <FormTextInput
          dense
          i18nKey='form.short-address.city'
          textContentType='addressCity'
        />
      </FormField>

      <FormField {...lens.focus('country').interop()}>
        <FormTextInput
          dense
          i18nKey='form.short-address.country'
          textContentType='countryName'
        />
      </FormField>
    </>
  );
}
