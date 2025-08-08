import { useTranslation } from 'react-i18next';
import { RadioButton, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { useFormField } from '@/components/ui/form/field';

export function FormBooleanInput() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    field: { onChange, value },
    fieldState: { invalid },
  } = useFormField();

  return (
    <RadioButton.Group
      onValueChange={(value) => onChange(JSON.parse(value))}
      value={String(value)}
    >
      <RadioButton.Item
        label={t('yes')}
        labelStyle={tw.style('text-lg', {
          color: invalid && theme.colors.error,
        })}
        mode='android'
        uncheckedColor={invalid ? theme.colors.error : undefined}
        value='true'
      />
      <RadioButton.Item
        label={t('no')}
        labelStyle={tw.style('text-lg', {
          color: invalid && theme.colors.error,
        })}
        mode='android'
        uncheckedColor={invalid ? theme.colors.error : undefined}
        value='false'
      />
    </RadioButton.Group>
  );
}
