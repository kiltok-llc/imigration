import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioButton } from 'react-native-paper';
import tw from 'twrnc';

import { toBoolean } from '@/lib/utils';

export function BooleanRadioGroup({
  onChange,
  value,
  ...props
}: Omit<
  ComponentProps<typeof RadioButton.Group>,
  'children' | 'onValueChange' | 'value'
> & {
  onChange: (value: boolean) => void;
  value?: boolean;
}) {
  const { t } = useTranslation();

  // TODO add circular radio buttons to radio buttons
  return (
    <RadioButton.Group
      onValueChange={(value) => onChange(toBoolean(value))}
      value={String(value)}
      {...props}
    >
      <RadioButton.Item
        label={t('yes')}
        labelStyle={tw`text-lg`}
        value='true'
      />
      <RadioButton.Item
        label={t('no')}
        labelStyle={tw`text-lg`}
        value='false'
      />
    </RadioButton.Group>
  );
}
