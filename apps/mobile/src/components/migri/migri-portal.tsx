import { Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View, ViewStyle } from 'react-native';
import { Icon, Modal, Portal, Text, useTheme } from 'react-native-paper';
import Animated, {
  BounceInRight,
  Easing,
  FadeIn,
  FadeOut,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { useInterval } from 'usehooks-ts';

import migri from '@/assets/migri/migri.gif';
import speechBubble from '@/assets/migri/speech-bubble.png';
import { transComponents, TransText } from '@/components/trans';
import { MigriEncounter, useCurrentMigri, useDismissMigri } from '@/lib/migri';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function MigriPortal() {
  const onDismiss = useDismissMigri();
  const current = useCurrentMigri();

  return (
    <Portal>
      <Modal
        contentContainerStyle={tw`size-full`}
        dismissable={true}
        onDismiss={onDismiss}
        style={tw`m-0`}
        visible={!!current}
      >
        {current && <MigriModalContent {...current} key={current.key} />}
      </Modal>
    </Portal>
  );
}

function AutoScrollView({ ...props }: ComponentProps<typeof ScrollView>) {
  const ref = useRef<ScrollView>(null);
  const heightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollRef = useRef(0);
  const SCROLL_RATIO = 0.5;
  const SCROLL_INTERVAL = 6000;

  useInterval(() => {
    const height = heightRef.current;
    const contentHeight = contentHeightRef.current;
    const scroll = scrollRef.current;

    if (scroll + height >= contentHeight - 1) {
      ref.current?.scrollTo({ y: 0 });
    } else {
      ref.current?.scrollTo({ y: scroll + height * SCROLL_RATIO });
    }
  }, SCROLL_INTERVAL);

  return (
    <ScrollView
      onContentSizeChange={(_w, h) => (contentHeightRef.current = h)}
      onLayout={(e) => (heightRef.current = e.nativeEvent.layout.height)}
      onScroll={(e) => (scrollRef.current = e.nativeEvent.contentOffset.y)}
      ref={ref}
      {...props}
    />
  );
}

function MigriModalContent({ callback, id, type }: MigriEncounter) {
  const { t } = useTranslation();
  const dismiss = useDismissMigri();
  const messages = t([`migri.${id}.${type}`, `migri.fallback.${type}`], {
    context: __DEV__ ? 'dev' : undefined,
    id,
    returnObjects: true,
  }) as string[];
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < messages.length - 1) {
      setIndex(index + 1);
    } else {
      dismiss();
      callback?.();
    }
  };

  const hasNext = index < messages.length - 1;

  return (
    <Pressable onPress={next} style={tw`flex-1`}>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut.delay(200)}
        style={tw.style(`absolute inset-x-5 bottom-50`, { aspectRatio: 3 / 2 })}
      >
        <Image
          contentFit='contain'
          source={speechBubble}
          style={tw`absolute inset-0`}
        />
        <View style={tw`absolute top-11 right-7 bottom-28 left-8`}>
          <AutoScrollView
            contentContainerStyle={tw`grow justify-center`}
            key={index}
            scrollEnabled={false}
          >
            <Animated.Text entering={ZoomIn}>
              <Text variant='bodyLarge'>
                <Trans components={transComponents}>{messages[index]}</Trans>
              </Text>
            </Animated.Text>
          </AutoScrollView>
        </View>
        <View style={tw`absolute right-7 bottom-20 left-8 h-6`}>
          {hasNext && <NextIndicator />}
        </View>
      </Animated.View>

      <View
        style={tw.style(
          'absolute right-0 bottom-0 h-96 translate-x-5 translate-y-15 -rotate-12',
          { aspectRatio: 1 / 2 }
        )}
      >
        <AnimatedImage
          contentFit='cover'
          entering={BounceInRight}
          exiting={SlideOutRight}
          source={migri}
          style={tw`flex-1`}
        />
      </View>
    </Pressable>
  );
}

function NextIndicator({ style }: { style?: ViewStyle }) {
  const theme = useTheme();
  const bounce = useSharedValue(0);
  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(1, { easing: Easing.out(Easing.quad) }),
        withTiming(0, { easing: Easing.in(Easing.quad) })
      ),
      0,
      true
    );

    return () => {
      bounce.value = 0;
    };
  }, [bounce]);

  const PADDING_DISTANCE = 2;
  const BOUNCE_DISTANCE = 3;
  const animatedStyle = useAnimatedStyle(() => ({
    paddingLeft: bounce.value * BOUNCE_DISTANCE + PADDING_DISTANCE,
    paddingRight: BOUNCE_DISTANCE - bounce.value * BOUNCE_DISTANCE,
  }));

  return (
    <Text style={tw`flex-1 font-light`} variant='bodyMedium'>
      <TransText i18nKey='migri.modal.next' />
      <Animated.View style={[tw`translate-y-0.6`, style, animatedStyle]}>
        <Icon
          color={theme.colors.onSurface}
          size={12}
          source={(props: any) => (
            <Entypo name='chevron-thin-right' {...props} />
          )}
        />
      </Animated.View>
    </Text>
  );
}
