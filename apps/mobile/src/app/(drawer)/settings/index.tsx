import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { reloadAppAsync } from 'expo';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { View } from 'react-native';
import { Dialog, Portal, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { DrawerToggleButton } from '@/components/drawer';
import { SettingsItem, SettingsSection } from '@/components/settings';
import { Trans, TransButton, TransText } from '@/components/trans';
import { useT } from '@/hooks/use-t';
import { defaultStorage } from '@/lib/mmkv';

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
            <SettingsItem icon='chevron-right' id='language' />
          </SettingsSection>
          <SettingsSection id='support'>
            <SettingsItem
              icon='launch'
              id='onboarding'
              onPress={() => router.dismissTo('/onboarding')}
            />
          </SettingsSection>
          <SettingsSection id='advanced'>
            <ResetSettingsItem />
          </SettingsSection>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

function ResetSettingsItem() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Portal>
        <Dialog onDismiss={() => setVisible(false)} visible={visible}>
          <Dialog.Title>
            <Trans i18nKey='settings.sections.advanced.reset.dialog.title' />
          </Dialog.Title>
          <Dialog.Content>
            <TransText i18nKey='settings.sections.advanced.reset.dialog.content' />
          </Dialog.Content>
          <Dialog.Actions>
            <View style={tw`flex-1`}>
              <TransButton
                i18nKey='settings.sections.advanced.reset.dialog.cancel'
                onPress={() => setVisible(false)}
              />
            </View>
            <View style={tw`flex-1`}>
              <TransButton
                buttonColor={theme.colors.error}
                i18nKey='settings.sections.advanced.reset.dialog.confirm'
                onPress={() => {
                  defaultStorage.clearAll();
                  void reloadAppAsync();
                }}
                textColor={theme.colors.onError}
              />
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <SettingsItem
        descriptionStyle={{
          color: theme.colors.error,
        }}
        id='reset'
        onPress={() => setVisible(true)}
        titleStyle={{
          color: theme.colors.error,
        }}
      />
    </>
  );
}
