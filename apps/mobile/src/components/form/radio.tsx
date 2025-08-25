import { ComponentProps, useEffect, useState } from 'react';
import { View } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import tw from 'twrnc';
import z from 'zod/v4';

import { useFormField } from '@/components/form/field';
import { SexEnum } from '@/lib/schemas';
import { useT } from '@/lib/translation';

export function FormBooleanInput() {
  return (
    <FormRadioGroup>
      <FormRadioItem i18nKey='form.boolean.yes' value={true} />
      <FormRadioItem i18nKey='form.boolean.no' value={false} />
    </FormRadioGroup>
  );
}

export function FormRadioGroup({ ...props }: ComponentProps<typeof View>) {
  const {
    field: { ref },
  } = useFormField();
  return <View ref={ref} {...props} />;
}

export function FormRadioItem<T>({
  color,
  i18nKey,
  labelStyle,
  uncheckedColor,
  value,
  ...props
}: Omit<ComponentProps<typeof RadioButton.Item>, 'label' | 'value'> & {
  i18nKey: string;
  value: T;
}) {
  const theme = useTheme();
  const t = useT();
  const {
    field: { disabled, onChange, value: selectedValue },
    fieldState: { invalid },
  } = useFormField();

  // fix bug with radio button animation
  // re render when selectedValue changes
  const [_, setFixAnimation] = useState();
  useEffect(() => {
    setFixAnimation(selectedValue);
  }, [selectedValue]);

  return (
    <RadioButton.Item
      color={invalid ? theme.colors.error : color}
      disabled={disabled}
      label={t(i18nKey)}
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
  return (
    <FormRadioGroup>
      <FormRadioItem<z.infer<typeof SexEnum>>
        i18nKey='form.sex.male'
        value='male'
      />
      <FormRadioItem<z.infer<typeof SexEnum>>
        i18nKey='form.sex.female'
        value='female'
      />
    </FormRadioGroup>
  );
}
