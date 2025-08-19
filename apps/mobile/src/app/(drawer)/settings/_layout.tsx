import Drawer from 'expo-router/drawer';
import * as React from 'react';
import { useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Stack } from '@/components/stack';

export default function SettingsLayout() {
  const theme = useTheme();

  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
      />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: tw`text-2xl`,
        }}
      />
    </>
  );
}
