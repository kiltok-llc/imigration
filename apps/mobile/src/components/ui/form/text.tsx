import { ComponentProps } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';

import { useFormField } from '@/components/ui/form/field';

export function FormTextInput({
                                ...props
                              }: ComponentProps<typeof TextInput>) {
  const {
    field: {onChange, value },
    fieldState: {error, invalid},
  } = useFormField();

  return (
    <View>
      <TextInput
        error={invalid}
        onChangeText={onChange}
        value={value}
        {...props}
      />
      <HelperText type='error' visible={!!error}>
        {error?.message}
      </HelperText>
    </View>
  );
}
