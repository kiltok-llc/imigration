import Drawer from 'expo-router/drawer';
import * as React from 'react';
import { useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Stack } from '@/components/stack';
import { useIsIndex } from '@/hooks/use-is-index';

export default function DrawerLayout() {
  const theme = useTheme();
  const isIndex = useIsIndex();

  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
          swipeEnabled: isIndex,
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
