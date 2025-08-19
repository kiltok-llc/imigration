import { ComponentProps } from 'react';
import { Dropdown, MultiSelectDropdown } from 'react-native-paper-dropdown';

import { useFormField } from '@/components/form/field';
import { useT } from '@/hooks/use-t';

export const LANGUAGE_OPTIONS = [
  'en',
  'es',
  'fr',
  'pt',
  'zh',
  'hi',
  'bn',
  'ru',
  'ja',
  'pa',
  'vi',
  'tr',
  'ar',
  'mr',
  'ko',
  'de',
  'it',
  'th',
  'id',
  'fil',
  'sw',
  'fa',
  'uk',
  'he',
  'el',
  'no',
  'da',
  'fi',
  'pl',
  'hu',
  'cs',
  'ro',
  'sk',
  'bg',
  'hr',
  'sl',
  'lt',
  'lv',
  'et',
  'is',
  'sr',
  'mk',
  'sq',
  'bs',
  'az',
  'hy',
  'ka',
  'uz',
  'kk',
  'ky',
  'tg',
  'ty',
  'yo',
  'zu',
  'xh',
  'af',
  'am',
  'ne',
  'si',
  'my',
  'km',
  'lo',
  'mn',
  'gu',
  'kn',
].map((value) => ({
  i18nKey: `language.${value}`,
  value,
}));

export function FormDropdown({
  i18nKey,
  options,
  ...props
}: Omit<ComponentProps<typeof Dropdown>, 'options'> & {
  i18nKey: string;
  options: { i18nKey: string; value: string }[];
}) {
  const t = useT();
  const {
    field: { disabled, onChange, ref, value },
    fieldState: { invalid },
  } = useFormField();

  return (
    <Dropdown
      disabled={disabled}
      error={invalid}
      label={t(i18nKey)}
      onSelect={onChange}
      options={options.map(({ i18nKey, value }) => ({
        label: t(i18nKey),
        value,
      }))}
      ref={ref}
      value={value ?? undefined}
      {...props}
    />
  );
}

export function FormMultiDropdown({
  i18nKey,
  options,
  ...props
}: Omit<ComponentProps<typeof MultiSelectDropdown>, 'options' | 'value'> & {
  i18nKey: string;
  options: { i18nKey: string; value: string }[];
}) {
  const t = useT();
  const {
    field: { disabled, onChange, ref, value },
    fieldState: { invalid },
  } = useFormField();

  return (
    <MultiSelectDropdown
      disabled={disabled}
      error={invalid}
      label={t(i18nKey)}
      onSelect={onChange}
      options={options.map(({ i18nKey, value }) => ({
        label: t(i18nKey),
        value,
      }))}
      ref={ref}
      value={value ?? undefined}
      {...props}
    />
  );
}
