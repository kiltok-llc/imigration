import { ComponentProps } from 'react';
import { Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { useFormField } from '@/components/ui/form/field';

export function FormLabel({
  children,
  style,
  ...props
}: ComponentProps<typeof Text>) {
  const theme = useTheme();
  const {
    fieldState: { invalid },
  } = useFormField();

  return (
    <Text
      style={[
        tw.style('text-center font-bold', {
          color: invalid ? theme.colors.error : undefined,
        }),
        style,
      ]}
      variant='headlineMedium'
      {...props}
    >
      {children}
    </Text>
  );
}
