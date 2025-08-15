import { Stack } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { LanguageButton } from '@/components/language-button';

export default function Language() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.language.screenTitle'),
        }}
      />
      <ScrollView contentContainerStyle={tw`grow`} style={tw`flex-1`}>
        <SafeAreaView edges={['bottom']} style={tw`flex-1 gap-2 p-4`}>
          <LanguageButton language='en' />
          <LanguageButton language='es' />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
