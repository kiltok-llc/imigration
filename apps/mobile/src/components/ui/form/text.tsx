import { ComponentProps } from 'react';
import { View } from 'react-native';
import { Text as RNText } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { useFormField } from '@/components/ui/form/field';

export function FormTextInput(
  {
    label,
    optional,
    required,
    style,
    ...props
  }: ComponentProps<typeof TextInput> & {
    optional?: boolean;
    required?: boolean;
  },
) {
  const theme = useTheme();
  const {
    field: { disabled, onBlur, onChange, ref, value },
    fieldState: { error, invalid },
  } = useFormField();

  return (
    <View>
      <TextInput
        disabled={disabled}
        error={invalid}
        label={(
          <>
            {label}
            {required && (
              <RNText style={{ color: theme.colors.error }}> *</RNText>
            )}
            {optional && (
              <RNText style={tw.style('normal-case font-normal', { color: theme.colors.onSurfaceDisabled })}> (optional)</RNText>
            )}
          </>
        )}
        onBlur={onBlur}
        onChangeText={onChange}
        ref={ref}
        style={[tw`uppercase text-red-500 font-medium`, style]}
        value={value}
        {...props}
      />
      <HelperText type="error" visible={!!error}>
        {error?.message}
      </HelperText>
    </View>
  );
}
