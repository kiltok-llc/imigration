import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import mxFlag from '@/assets/flags/mx.png';
import usFlag from '@/assets/flags/us.png';
import personPassport from '@/assets/onboarding/person-passport.png';
import banner from '@/assets/onboarding/usa-banner.png';
import { isOnboardedAtom } from '@/atoms/is-onboarding-atom';
import { TransButton, TransText } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { withImageIcon } from '@/lib/with-image-icon';

export default function Onboarding() {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const setIsOnboarded = useSetAtom(isOnboardedAtom);

  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={tw`flex-1`}>
        <Image source={banner} style={tw.style('w-full', { aspectRatio: 2 })} />
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={tw`grow`}
        >
          <SafeAreaView edges={['bottom']} style={tw`flex-1`}>
            <Container style={tw`flex-1 items-center gap-4`}>
              <TransText
                i18nKey='onboarding.title'
                style={tw.style('text-center', { color: theme.colors.primary })}
                variant='displayMedium'
              />
              <TransText
                i18nKey='onboarding.language'
                style={tw.style('text-center', { color: theme.colors.primary })}
                variant='headlineSmall'
              />
              <Image
                source={personPassport}
                style={tw.style('mt-auto h-56', { aspectRatio: 1 })}
              />
              <TransButton
                contentStyle={tw`justify-start gap-2`}
                i18nKey='onboarding.english'
                icon={withImageIcon(usFlag)}
                labelStyle={tw`text-2xl`}
                mode='outlined'
                onPress={() => i18n.changeLanguage('en')}
                style={{
                  backgroundColor: theme.colors.surface,
                }}
              />
              <TransButton
                contentStyle={tw`justify-start gap-2`}
                i18nKey='onboarding.spanish'
                icon={withImageIcon(mxFlag)}
                labelStyle={tw`text-2xl`}
                mode='outlined'
                onPress={() => i18n.changeLanguage('es')}
                style={{
                  backgroundColor: theme.colors.surface,
                }}
              />
              <TransButton
                contentStyle={tw`flex-row-reverse`}
                i18nKey='next'
                icon='arrow-right'
                labelStyle={tw`text-2xl`}
                onPress={() => {
                  setIsOnboarded(true);
                  router.replace('/services');
                }}
              />
            </Container>
          </SafeAreaView>
        </ScrollView>
      </View>
    </>
  );
}
