import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { DrawerToggleButton } from '@/components/drawer';
import { SettingsItem, SettingsSection } from '@/components/settings';

export default function Index() {
  const { t } = useTranslation();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: ({ tintColor }) => (
            <DrawerToggleButton navigation={navigation} tintColor={tintColor} />
          ),
          title: t('settings.screenTitle'),
        }}
      />
      <ScrollView contentContainerStyle={tw`grow`} style={tw`flex-1`}>
        <SafeAreaView edges={['bottom']} style={tw`flex-1`}>
          <SettingsSection id='language-and-accessibility'>
            <SettingsItem id='language' />
          </SettingsSection>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
