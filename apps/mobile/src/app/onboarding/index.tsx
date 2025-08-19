import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import personPassport from '@/assets/onboarding/person-passport.png';
import banner from '@/assets/onboarding/usa-banner.png';
import { isOnboardedAtom } from '@/atoms/is-onboarding-atom';
import { LanguageButton } from '@/components/language-button';
import { TransButton, TransText } from '@/components/trans';
import { Container } from '@/components/ui/container';

export default function Onboarding() {
  const theme = useTheme();
  const router = useRouter();
  const setIsOnboarded = useSetAtom(isOnboardedAtom);

  return (
    <>
      <Stack.Screen
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
                i18nKey='onboarding.choose-language'
                style={tw.style('text-center', { color: theme.colors.primary })}
                variant='headlineSmall'
              />
              <Image
                source={personPassport}
                style={tw.style('mt-auto h-56', { aspectRatio: 1 })}
              />
              <LanguageButton language='en' />
              <LanguageButton language='es' />
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
