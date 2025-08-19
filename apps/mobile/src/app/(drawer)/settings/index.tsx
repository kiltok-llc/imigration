import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { DrawerToggleButton } from '@/components/drawer';
import { SettingsItem, SettingsSection } from '@/components/settings';
import { useT } from '@/hooks/use-t';

export default function Index() {
  const t = useT();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const router = useRouter();

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
          <SettingsSection id='support'>
            <SettingsItem
              icon='launch'
              id='onboarding'
              onPress={() => router.dismissTo('/onboarding')}
            />
          </SettingsSection>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
