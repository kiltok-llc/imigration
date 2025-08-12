import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import mxFlag from '@/assets/flags/mx.png';
import usFlag from '@/assets/flags/us.png';
import personPassport from '@/assets/onboarding/person-passport.png';
import banner from '@/assets/onboarding/usa-banner.png';
import { isOnboardedAtom } from '@/atoms/onboarding';
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
      <Stack.Screen options={{ headerShown: false }} />
      <View style={tw`flex-1`}>
        <Image source={banner} style={tw.style('w-full', { aspectRatio: 2 })} />
        <SafeAreaView edges={['left', 'bottom', 'right']} style={tw`flex-1`}>
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
              contentStyle={tw`justify-start`}
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
              contentStyle={tw`justify-start`}
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
              i18nKey='next'
              labelStyle={tw`text-2xl`}
              mode='contained'
              onPress={() => {
                setIsOnboarded(true);
                router.replace('/services');
              }}
            />
          </Container>
        </SafeAreaView>
      </View>
    </>
  );
}
