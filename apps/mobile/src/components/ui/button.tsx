import { ComponentProps } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Button as PaperButton } from 'react-native-paper';
import tw from 'twrnc';

export function Button({
  children,
  contentStyle,
  labelStyle,
  size = 'md',
  style,
  ...props
}: ComponentProps<typeof PaperButton> & {
  size?: 'md' | 'sm';
}) {
  return (
    <PaperButton
      contentStyle={[tw.style(size === 'md' && 'py-1'), contentStyle]}
      labelStyle={[tw.style(size === 'md' && 'text-lg'), labelStyle]}
      mode='contained'
      style={[tw`w-full`, style]}
      {...props}
    >
      {children}
    </PaperButton>
  );
}
