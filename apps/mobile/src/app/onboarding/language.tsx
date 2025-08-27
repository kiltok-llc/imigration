import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import personPassport from '@/assets/onboarding/person-passport.png';
import banner from '@/assets/onboarding/usa-banner.png';
import { TransButton, TransText } from '@/components/trans';

export default function Language() {
  const theme = useTheme();
  const router = useRouter();

  useTranslation(); // re render on language change

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
              i18nKey='onboarding.language.title'
              style={tw.style('text-center', { color: theme.colors.primary })}
              variant='displayMedium'
            />
            <TransText
              i18nKey='onboarding.language.choose-language'
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
              router.navigate('/onboarding/migri');
            }}
          />
        </SafeAreaView>
      </View>
    </>
  );
}

function LanguageButton({ language }: { language: string }) {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const active = language === i18n.language;

  return (
    <TransButton
      buttonColor={theme.colors.surface}
      contentStyle={tw`flex-row-reverse justify-between gap-2`}
      i18nKey={`language.${language}`}
      icon={({ size }) => (
        <MaterialCommunityIcons
          color={active ? theme.colors.secondary : theme.colors.outline}
          name={active ? 'checkbox-marked-circle-outline' : 'circle-outline'}
          size={size * 1.2}
        />
      )}
      labelStyle={tw.style('text-2xl', active && 'font-semibold')}
      mode='outlined'
      onPress={() => void i18n.changeLanguage(language)}
      style={tw.style(
        'border-2',
        active && {
          borderColor: theme.colors.secondary,
        }
      )}
    />
  );
}
