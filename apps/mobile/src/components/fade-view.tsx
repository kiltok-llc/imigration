import { ComponentProps, useEffect } from 'react';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

export function FadeView({
  style,
  visible,
  ...props
}: ComponentProps<typeof Animated.View> & {
  visible: boolean;
}) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [opacity, visible]);

  return <Animated.View style={[style, { opacity }]} {...props} />;
}
