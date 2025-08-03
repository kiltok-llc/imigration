import { ComponentProps } from 'react';
import { Button as PaperButton } from 'react-native-paper';
import tw from 'twrnc';

export function Button({
  children,
  contentStyle,
  labelStyle,
  style,
  ...props
}: ComponentProps<typeof PaperButton>) {
  return (
    <PaperButton
      contentStyle={[tw`py-1`, contentStyle]}
      labelStyle={[tw`text-lg`, labelStyle]}
      mode='contained'
      style={[tw`w-full`, style]}
      {...props}
    >
      {children}
    </PaperButton>
  );
}
