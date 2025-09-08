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
  hint,
  i18nKey,
  style,
  ...props
}: ComponentProps<typeof TextInput> & {
  hint?: 'optional' | 'required';
  i18nKey: string;
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
        onFocus={() => {
          setOpen(true);
        }}
        ref={mergeRefs([inputRef, ref])}
        right={<TextInput.Icon icon='calendar' />}
        showSoftInputOnFocus={false}
        value={value ? FORMAT.format(value) : ''}
        {...props}
      />
      {error?.message && <HelperText type='error'>{error?.message}</HelperText>}
    </View>
  );
}
