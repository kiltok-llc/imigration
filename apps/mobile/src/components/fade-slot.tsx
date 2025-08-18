import { Slot } from 'expo-router';
import { PropsWithChildren, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';

import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

const FadeSlotContext = createRequiredContext<boolean>();

export function FadeSlot() {
  const [isFirstRender, setIsFirstRender] = useState(true);

  return (
    <View onLayout={() => setIsFirstRender(false)} style={tw`flex-1`}>
      <FadeSlotContext.Provider value={isFirstRender}>
        <Slot />
      </FadeSlotContext.Provider>
    </View>
  );
}

export function FadeSlotPageWrapper({ children }: PropsWithChildren) {
  const isFirstRender = useRequiredContext(FadeSlotContext);

  return (
    <Animated.View
      entering={isFirstRender ? undefined : FadeIn.delay(300)}
      exiting={FadeOut}
      style={tw`flex-1`}
    >
      {children}
    </Animated.View>
  );
}
