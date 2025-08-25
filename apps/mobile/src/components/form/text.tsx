import { ComponentProps, forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Text as NativeText, TextInput as NativeTextInput } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import Animated, { LinearTransition } from 'react-native-reanimated';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { Trans } from '@/components/trans';

type TextInputProps = ComponentProps<typeof TextInput> & {
  i18nKey?: string;
  optional?: boolean;
  required?: boolean;
};

export const FormTextInput = forwardRef<NativeTextInput, TextInputProps>(
  function FormTextInput(
    { i18nKey, optional, required, style, ...props },
    ref
  ) {
    const theme = useTheme();
    const {
      field: { disabled, onBlur, onChange, ref: fieldRef, value },
      fieldState: { error, invalid },
    } = useFormField();

    return (
      <Animated.View layout={LinearTransition}>
        <TextInput
          disabled={disabled}
          error={invalid}
          label={
            <>
              <NativeText>
                <Trans i18nKey={i18nKey} />
              </NativeText>
              {required && (
                <NativeText style={{ color: theme.colors.error }}>
                  <Trans i18nKey='form.required' />
                </NativeText>
              )}
              {optional && (
                <NativeText
                  style={tw.style('font-normal normal-case', {
                    color: theme.colors.onSurfaceDisabled,
                  })}
                >
                  <Trans i18nKey='form.optional' />
                </NativeText>
              )}
            </>
          }
          onBlur={onBlur}
          onChangeText={onChange}
          ref={mergeRefs([fieldRef, ref])}
          style={[{ textAlignVertical: 'top' }, style]}
          value={value}
          {...props}
        />
        {error?.message && (
          <HelperText type='error' visible={!!error}>
            {error?.message}
          </HelperText>
        )}
      </Animated.View>
    );
  }
);
