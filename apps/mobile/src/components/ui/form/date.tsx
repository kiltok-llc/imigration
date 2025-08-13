import { ComponentProps, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Text as RNText, TextInput as RNTextInput, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { useFormField } from '@/components/ui/form/field';

const FORMAT = Intl.DateTimeFormat('en-US');

export function FormDateInput({
  label,
  optional,
  required,
  style,
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

  const inputRef = useRef<RNTextInput>(null);
  const [open, setOpen] = useState(false);

  return (
    <View>
      <DatePicker
        date={value instanceof Date ? value : new Date()}
        modal
        mode='date'
        onCancel={() => {
          inputRef.current?.blur();
          setOpen(false);
        }}
        onConfirm={(date) => {
          inputRef.current?.blur();
          setOpen(false);
          onChange(date);
        }}
        open={open}
      />
      <TextInput
        caretHidden
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
        onFocus={() => {
          setOpen(true);
        }}
        ref={mergeRefs([inputRef, ref])}
        right={
          <TextInput.Icon
            icon='calendar'
            onPress={
              __DEV__
                ? () => {
                    toast('Set date to null (Dev Only)');
                    onChange(null);
                  }
                : undefined
            }
          />
        }
        value={value ? FORMAT.format(value) : ''}
        {...props}
      />
      <HelperText type='error' visible={!!error}>
        {error?.message}
      </HelperText>
    </View>
  );
}
