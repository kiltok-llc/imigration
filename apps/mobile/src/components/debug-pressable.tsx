import { ComponentProps } from 'react';
import { Pressable } from 'react-native';

export function DebugPressable({
  onPress,
  ...props
}: ComponentProps<typeof Pressable>) {
  return <Pressable onPress={__DEV__ ? onPress : undefined} {...props} />;
}
