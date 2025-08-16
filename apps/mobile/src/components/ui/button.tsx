import { ComponentProps, forwardRef } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line no-restricted-imports
import { Button as PaperButton } from 'react-native-paper';
import tw from 'twrnc';

type ButtonProps = ComponentProps<typeof PaperButton> & {
  size?: 'md' | 'sm';
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    children,
    contentStyle,
    labelStyle,
    size = 'md',
    style,
    ...props
  }: ButtonProps,
  ref
) {
  return (
    <PaperButton
      contentStyle={[tw.style(size === 'md' && 'py-1'), contentStyle]}
      labelStyle={[tw.style(size === 'md' && 'text-lg'), labelStyle]}
      mode='contained'
      ref={ref}
      style={[tw`w-full`, style]}
      {...props}
    >
      {children}
    </PaperButton>
  );
});
