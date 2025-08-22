import { ComponentProps } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';

import { useIsFirstRender } from '@/hooks/use-is-first-render';

export function FormBlock({
  animated,
  style,
  ...props
}: ComponentProps<typeof View> & { animated?: boolean }) {
  const isFirstRender = useIsFirstRender();

  if (animated) {
    return (
      <Animated.View
        entering={isFirstRender ? undefined : FadeIn}
        exiting={FadeOut}
        style={[tw`gap-4`, style]}
        {...props}
      />
    );
  }

  return <View style={[tw`gap-4`, style]} {...props} />;
}
