import { ComponentProps, forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Text as NativeText, TextInput as NativeTextInput } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import Animated, { LinearTransition } from 'react-native-reanimated';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { Trans } from '@/components/trans';

type TextInputProps = ComponentProps<typeof TextInput> & {
  hint?: 'optional' | 'required';
  i18nKey?: string;
};

export const FormTextInput = forwardRef<NativeTextInput, TextInputProps>(
  function FormTextInput({ hint, i18nKey, style, ...props }, ref) {
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
              {hint === 'required' && (
                <NativeText style={{ color: theme.colors.error }}>
                  <Trans i18nKey='form.required' />
                </NativeText>
              )}
              {hint === 'optional' && (
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
          <HelperText type='error'>{error?.message}</HelperText>
        )}
      </Animated.View>
    );
  }
);

export const FormCommaListInput = forwardRef<NativeTextInput, TextInputProps>(
  function FormTextInput({ hint, i18nKey, style, ...props }, ref) {
    const theme = useTheme();
    const {
      field: { disabled, onBlur, onChange, ref: fieldRef, value },
      fieldState: { error, invalid },
    } = useFormField();

    const errors = Array.isArray(error)
      ? error.map((e) => e.message as string)
      : error?.message
        ? [error.message]
        : [];

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
              {hint === 'required' && (
                <>
                  <NativeText
                    style={tw.style('font-normal normal-case', {
                      color: theme.colors.onSurfaceDisabled,
                    })}
                  >
                    <Trans i18nKey='form.comma' />
                  </NativeText>
                  <NativeText style={{ color: theme.colors.error }}>
                    <Trans i18nKey='form.required' />
                  </NativeText>
                </>
              )}
              {hint === 'optional' && (
                <NativeText
                  style={tw.style('font-normal normal-case', {
                    color: theme.colors.onSurfaceDisabled,
                  })}
                >
                  <Trans i18nKey='form.optional-comma' />
                </NativeText>
              )}
              {hint === undefined && (
                <NativeText
                  style={tw.style('font-normal normal-case', {
                    color: theme.colors.onSurfaceDisabled,
                  })}
                >
                  <Trans i18nKey='form.comma' />
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
        {errors && <HelperText type='error'>{errors.join('\n')}</HelperText>}
      </Animated.View>
    );
  }
);
