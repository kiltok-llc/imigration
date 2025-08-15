import { ComponentProps, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import {
  CheckboxProps,
  Checkbox as PaperCheckbox,
  useTheme,
} from 'react-native-paper';

import { useFormField } from '@/components/form/field';
import { arraysEqual } from '@/lib/utils';

export function FormCheckboxGroup({ ...props }: ComponentProps<typeof View>) {
  const {
    field: { ref },
  } = useFormField();
  return <View ref={ref} {...props} />;
}

export function FormCheckboxItem<T>({
  exclusive = false,
  value,
  ...props
}: Omit<ComponentProps<typeof PaperCheckbox.Item>, 'status'> & {
  exclusive?: boolean;
  status?: CheckboxProps['status'];
  value: T;
}) {
  const theme = useTheme();
  const {
    field: { disabled, onChange, value: values },
    fieldState: { invalid },
  } = useFormField();

  const checked = values.includes(value);

  const toggle = useCallback(() => {
    if (checked) {
      onChange(values.filter((v: any) => v !== value));
    } else {
      onChange(exclusive ? [value] : [...values, value]);
    }
  }, [checked, exclusive, onChange, value, values]);

  // Need to uncheck ourselves if we are exclusive but another box is checked
  useEffect(() => {
    if (exclusive && checked && !arraysEqual(values, [value])) {
      toggle();
    }
  }, [checked, exclusive, toggle, value, values]);

  return (
    <PaperCheckbox.Item
      color={invalid ? theme.colors.error : undefined}
      disabled={disabled}
      labelStyle={{
        color: invalid ? theme.colors.error : undefined,
      }}
      mode='android'
      onPress={toggle}
      status={checked ? 'checked' : 'unchecked'}
      uncheckedColor={invalid ? theme.colors.error : undefined}
      {...props}
    />
  );
}
