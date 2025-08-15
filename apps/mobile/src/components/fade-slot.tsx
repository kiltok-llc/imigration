import { Slot } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';

import { useFocusedRouteName } from '@/hooks/use-route';

export function FadeSlot() {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const routeName = useFocusedRouteName();

  return (
    <Animated.View
      entering={isFirstRender ? undefined : FadeIn.delay(300)}
      exiting={FadeOut}
      key={routeName}
      onLayout={() => setIsFirstRender(false)}
      style={tw`flex-1`}
    >
      <Slot />
    </Animated.View>
  );
}
