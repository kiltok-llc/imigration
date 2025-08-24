import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import personPassport from '@/assets/onboarding/person-passport.png';
import banner from '@/assets/onboarding/usa-banner.png';
import { isOnboardingCompleteAtom } from '@/atoms/is-onboarding-complete-atom';
import { LanguageButton } from '@/components/language-button';
import { TransButton, TransText } from '@/components/trans';

export default function Onboarding() {
  const theme = useTheme();
  const router = useRouter();
  const setIsOnboarded = useSetAtom(isOnboardingCompleteAtom);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={tw`flex-1`}>
        <Image
          source={banner}
          style={tw.style('w-full pb-2', { aspectRatio: 2 })}
        />
        <SafeAreaView
          edges={{ bottom: 'maximum' }}
          style={tw`flex-1 items-center gap-4 p-4`}
        >
          <ScrollView
            alwaysBounceVertical={false}
            contentContainerStyle={tw`grow gap-4`}
            scrollsToTop={false}
            style={tw`flex-1`}
          >
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
            <View style={tw`mt-auto w-full items-center`}>
              <Image
                source={personPassport}
                style={tw.style('h-56 translate-y-1.5 -rotate-3', {
                  aspectRatio: 1,
                })}
              />
              <View style={tw`w-full gap-2`}>
                <LanguageButton language='en' />
                <LanguageButton language='es' />
              </View>
            </View>
          </ScrollView>
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
        </SafeAreaView>
      </View>
    </>
  );
}
