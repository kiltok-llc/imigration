import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';
import Animated, {
  BounceInRight,
  FadeIn,
  FadeOut,
  SlideOutRight,
  ZoomIn,
} from 'react-native-reanimated';
import tw from 'twrnc';

import migri from '@/assets/migri/migri.gif';
import speechBubble from '@/assets/migri/speech-bubble.png';
import { MigriEncounter, useCurrentMigri, useDismissMigri } from '@/lib/migri';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function MigriModal({ ready }: { ready: boolean }) {
  const onDismiss = useDismissMigri();
  const current = useCurrentMigri();

  return (
    <Modal
      contentContainerStyle={tw`size-full`}
      dismissable={true}
      onDismiss={onDismiss}
      style={tw`m-0`}
      visible={!!current}
    >
      {ready && current && <MigriModalContent {...current} key={current.key} />}
    </Modal>
  );
}

function MigriModalContent({ id }: MigriEncounter) {
  const { t } = useTranslation();
  const dismiss = useDismissMigri();
  const messages = t(`migri.${id}`, { returnObjects: true }) as string[];
  const [index, setIndex] = useState(0);

  // const prev = () => {
  //   if (index > 0) {
  //     setIndex(index - 1);
  //   } else {
  //     dismiss();
  //   }
  // }

  const next = () => {
    if (index < messages.length - 1) {
      setIndex(index + 1);
    } else {
      dismiss();
    }
  };

  // const hasNext = index < messages.length - 1;

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
        <View style={tw`absolute inset-0 mt-11 mr-5 mb-19 ml-7 justify-center`}>
          <Animated.Text entering={ZoomIn} key={index}>
            <Text variant='bodyLarge'>{messages[index]}</Text>
          </Animated.Text>
        </View>
      </Animated.View>

      <View
        style={tw.style(
          'absolute right-0 bottom-0 h-96 translate-x-3 translate-y-15 -rotate-15',
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
