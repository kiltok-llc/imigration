import { ComponentProps } from 'react';
import { Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { TransText } from '@/components/trans';

export function FormLabel(
  {
    i18nKey,
    style,
    ...props
  }: Omit<ComponentProps<typeof Text>, 'children'> & {
    i18nKey: string;
  }) {
  const theme = useTheme();
  const {
    fieldState: { invalid },
  } = useFormField();

  return (
    <TransText
      i18nKey={i18nKey}
      style={[tw.style(invalid && { color: theme.colors.error }), style]}
      {...props}
    />
  );
}
