import { ComponentProps } from 'react';
import { Text as RNText, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { useFormField } from '@/components/ui/form/field';

export function FormTextInput({
  label,
  optional,
  required,
  ...props
}: ComponentProps<typeof TextInput> & {
  optional?: boolean;
  required?: boolean;
}) {
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
        label={
          <>
            {label}
            {required && (
              <RNText style={{ color: theme.colors.error }}>
                <Trans i18nKey='form.required' />
              </RNText>
            )}
            {optional && (
              <RNText
                style={tw.style('font-normal normal-case', {
                  color: theme.colors.onSurfaceDisabled,
                })}
              >
                <Trans i18nKey='form.optional' />
              </RNText>
            )}
          </>
        }
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
