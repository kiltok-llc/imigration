import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import tw from 'twrnc';
import z from 'zod/v4';

import { useFormField } from '@/components/ui/form/field';
import { SexEnum } from '@/lib/schema/common';

export function FormBooleanInput() {
  const { t } = useTranslation();

  return (
    <FormRadioGroup>
      <FormRadioItem label={t('form.boolean.yes')} value={true} />
      <FormRadioItem label={t('form.boolean.no')} value={false} />
    </FormRadioGroup>
  );
}

export function FormRadioGroup({
  children,
  ...props
}: ComponentProps<typeof View>) {
  const {
    field: { ref },
  } = useFormField();
  return (
    <View ref={ref} {...props}>
      {children}
      {__DEV__ && <FormRadioItem label='Null (Dev Only)' value={null} />}
    </View>
  );
}

export function FormRadioItem<T>({
  color,
  labelStyle,
  uncheckedColor,
  value,
  ...props
}: Omit<ComponentProps<typeof RadioButton.Item>, 'label' | 'value'> & {
  label?: string;
  value: T;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    field: { disabled, onChange, value: selectedValue },
    fieldState: { invalid },
  } = useFormField();

  return (
    <RadioButton.Item
      color={invalid ? theme.colors.error : color}
      disabled={disabled}
      label={t(`form.${value}`)}
      labelStyle={[
        labelStyle,
        tw.style(
          invalid && {
            color: theme.colors.error,
          }
        ),
      ]}
      mode='android'
      onPress={() => onChange(value)}
      status={selectedValue === value ? 'checked' : 'unchecked'}
      uncheckedColor={invalid ? theme.colors.error : uncheckedColor}
      value={String(value)}
      {...props}
    />
  );
}

export function FormSexInput() {
  const { t } = useTranslation();

  return (
    <FormRadioGroup>
      <FormRadioItem<z.infer<typeof SexEnum>>
        label={t('form.sex.male')}
        value='male'
      />
      <FormRadioItem<z.infer<typeof SexEnum>>
        label={t('form.sex.female')}
        value='female'
      />
    </FormRadioGroup>
  );
}
