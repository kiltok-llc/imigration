import { ComponentProps, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

const OPACITY_ZERO = __DEV__ ? 0.2 : 0;

export function FadeView({
  style,
  visible,
  ...props
}: ComponentProps<typeof View> & {
  visible?: boolean;
}) {
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : OPACITY_ZERO, { duration: 300 });
  }, [opacity, visible]);

  if (visible === undefined) {
    return <View style={style} {...props} />;
  }

  return <Animated.View style={[style, { opacity }]} {...props} />;
}
