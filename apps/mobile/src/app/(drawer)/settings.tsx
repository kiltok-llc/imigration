import Drawer from 'expo-router/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';

import { TransButton, TransText } from '@/components/trans';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <>
      <Drawer.Screen
        options={{
          headerTitle: t('settings.screenTitle'),
        }}
      />
      <View style={tw`flex-1 items-center justify-center`}>
        <TransText i18nKey='settings.description' />
        <TransButton
          i18nKey='settings.button'
          onPress={() => {
            console.log('Settings button pressed');
          }}
        />
      </View>
    </>
  );
}
