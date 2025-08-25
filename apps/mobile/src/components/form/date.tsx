import { ComponentProps, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { Trans } from '@/components/trans';

const FORMAT = Intl.DateTimeFormat('en-US');

export function FormDateInput({
  i18nKey,
  optional,
  required,
  style,
  ...props
}: ComponentProps<typeof TextInput> & {
  i18nKey: string;
  optional?: boolean;
  required?: boolean;
}) {
  const theme = useTheme();
  const {
    field: { disabled, onBlur, onChange, ref, value },
    fieldState: { error, invalid },
  } = useFormField();

  const inputRef = useRef<NativeTextInput>(null);
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
        onFocus={() => {
          setOpen(true);
        }}
        ref={mergeRefs([inputRef, ref])}
        right={<TextInput.Icon icon='calendar' />}
        showSoftInputOnFocus={false}
        value={value ? FORMAT.format(value) : ''}
        {...props}
      />
      {error?.message && (
        <HelperText type='error' visible={!!error}>
          {error?.message}
        </HelperText>
      )}
    </View>
  );
}
