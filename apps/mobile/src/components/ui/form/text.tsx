import { ComponentProps } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { useFormField } from '@/components/ui/form/field';

export function FormTextInput({ ...props }: ComponentProps<typeof TextInput>) {
  const {
    field: { disabled, onBlur, onChange, ref, value },
    fieldState: { error, invalid },
  } = useFormField();

  return (
    <View>
      <TextInput
        disabled={disabled}
        error={invalid}
        onBlur={onBlur}
        onChangeText={onChange}
        ref={ref}
        value={value}
        {...props}
      />
      <HelperText type='error' visible={!!error}>
        {error?.message}
      </HelperText>
    </View>
  );
}
