import { ComponentProps } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

export function FormBlock({ style, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      style={[tw`gap-4`, style]}
      {...props}
    />
  );
}