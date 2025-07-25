import { ComponentProps, PropsWithChildren, useRef, useState } from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput } from 'react-native';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Text, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

export function FormDateInput<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  disabled = false,
  label,
  name,
}: {
  disabled?: boolean;
  label: string;
  name: TName;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<RNTextInput>(null);
  const { control } = useFormContext<
    TFieldValues,
    TContext,
    TTransformedValues
  >();
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <View style={tw`flex-1 gap-2`}>
          <TextInput
            caretHidden
            disabled={disabled}
            error={!!error}
            label={label}
            onBlur={onBlur}
            onFocus={() => {
              setOpen(true);
            }}
            placeholder={t('form.date.placeholder')}
            ref={inputRef}
            right={<TextInput.Icon icon='calendar' />}
            value={value?.toLocaleDateString()}
          />
          <DatePicker
            date={value}
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
          <Text
            style={tw.style({ color: theme.colors.error })}
            variant='bodySmall'
          >
            {error?.message}
          </Text>
        </View>
      )}
    ></Controller>
  );
}

export function FormLayout({ children }: PropsWithChildren) {
  return <View style={tw`flex-1 gap-4 p-4`}>{children}</View>;
}

export function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  disabled,
  name,
  ...props
}: ComponentProps<typeof TextInput> & {
  name: TName;
}) {
  const theme = useTheme();
  const { control } = useFormContext<
    TFieldValues,
    TContext,
    TTransformedValues
  >();
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <View style={tw`flex-1 gap-2`}>
          <TextInput
            disabled={disabled}
            error={!!error}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
          <Text
            style={tw.style({ color: theme.colors.error })}
            variant='bodySmall'
          >
            {error?.message}
          </Text>
        </View>
      )}
    ></Controller>
  );
}
