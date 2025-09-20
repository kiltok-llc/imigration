import { ComponentProps, forwardRef } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line no-restricted-imports
import { Button as PaperButton } from 'react-native-paper';
import tw from 'twrnc';

type ButtonProps = ComponentProps<typeof PaperButton> & {
  shrink?: boolean;
  size?: 'lg' | 'md' | 'sm';
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    children,
    contentStyle,
    labelStyle,
    shrink = false,
    size = 'md',
    style,
    ...props
  }: ButtonProps,
  ref
) {
  return (
    <PaperButton
      contentStyle={[
        tw.style(size === 'md' && 'py-0.5', size === 'lg' && 'py-0.5'),
        contentStyle,
      ]}
      labelStyle={[
        tw.style(size === 'md' && 'text-lg', size === 'lg' && 'text-xl'),
        labelStyle,
      ]}
      mode='contained'
      ref={ref}
      style={[tw.style(shrink || 'w-full'), style]}
      {...props}
    >
      {children}
    </PaperButton>
  );
});
