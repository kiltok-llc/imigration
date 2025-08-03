import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { Pressable, View } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import migri from '@/assets/migri/migri.png';
import { MigriButton } from '@/components/migri/migri-button';
import { TransText } from '@/components/trans';
import { isOnboardingCompleteAtom } from '@/lib/onboarding';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Migri() {
  const theme = useTheme();
  const router = useRouter();
  const setIsOnboarded = useSetAtom(isOnboardingCompleteAtom);
  const rotation = useSharedValue(0);

  const spin = () => {
    rotation.value = withDecay({
      deceleration: 0.9997,
      velocity: 1.7,
    });
  };

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${(rotation.value * 360) % 360}deg` }],
  }));

  return (
    <>
      <Stack.Screen options={{}} />
      <View
        style={tw.style('flex-1', {
          backgroundColor: theme.colors.secondaryContainer,
        })}
      >
        <View style={tw`w-full flex-1 items-center justify-center`}>
          <Pressable onPress={spin}>
            <AnimatedImage
              source={migri}
              style={[tw.style(`h-112`, { aspectRatio: 1 / 2 }), imageStyle]}
            />
          </Pressable>
        </View>
        <Surface style={tw`rounded-t-3xl`}>
          <SafeAreaView
            edges={{ bottom: 'maximum' }}
            style={tw`items-center gap-8 px-4 py-16`}
          >
            <View style={tw`gap-4`}>
              <TransText
                i18nKey='onboarding.migri.title'
                style={tw.style('text-center')}
                variant='displaySmall'
              />
              <TransText
                i18nKey='onboarding.migri.description'
                style={tw.style('text-center', { color: theme.colors.primary })}
                variant='titleMedium'
              />
            </View>
            <MigriButton
              callback={() => {
                setIsOnboarded(true);
                router.dismissAll();
                router.replace('/services');
              }}
              extended={true}
              id='onboarding.migri'
            />
          </SafeAreaView>
        </Surface>
      </View>
    </>
  );
}
