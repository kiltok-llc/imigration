import { ComponentProps } from 'react';
import { Text as RNText } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import Animated, { LinearTransition } from 'react-native-reanimated';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { Trans } from '@/components/trans';

export function FormTextInput({
                                i18nKey,
                                optional,
                                required,
                                ...props
                              }: ComponentProps<typeof TextInput> & {
  i18nKey?: string;
  optional?: boolean;
  required?: boolean;
}) {
  const theme = useTheme();
  const {
    field: { disabled, onBlur, onChange, ref, value },
    fieldState: { error, invalid },
  } = useFormField();

  return (
    <Animated.View layout={LinearTransition}>
      <TextInput
        disabled={disabled}
        error={invalid}
        label={
          <>
            <RNText>
              <Trans i18nKey={i18nKey} />
            </RNText>
            {required && (
              <RNText style={{ color: theme.colors.error }}>
                <Trans i18nKey="form.required" />
              </RNText>
            )}
            {optional && (
              <RNText
                style={tw.style('font-normal normal-case', {
                  color: theme.colors.onSurfaceDisabled,
                })}
              >
                <Trans i18nKey="form.optional" />
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
      {error?.message && (
        <HelperText type="error" visible={!!error}>
          {error?.message}
        </HelperText>
      )}
    </Animated.View>
  );
}
