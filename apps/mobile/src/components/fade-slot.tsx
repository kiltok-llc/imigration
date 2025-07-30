import { Slot } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useFocusedRouteName } from '@/hooks/use-focused-route-name';


export function FadeSlot() {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const routeName = useFocusedRouteName();

  return (
    <Animated.View
      entering={isFirstRender ? undefined : FadeIn.delay(300)}
      exiting={FadeOut}
      key={routeName}
      onLayout={() => setIsFirstRender(false)}
    >
      <Slot/>
    </Animated.View>
  )
}