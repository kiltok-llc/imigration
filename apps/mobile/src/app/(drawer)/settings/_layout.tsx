import Drawer from 'expo-router/drawer';
import * as React from 'react';
import { useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Stack } from '@/components/stack';
import { useFocusedRouteName } from '@/hooks/use-route';

export default function DrawerLayout() {
  const theme = useTheme();
  const routeName = useFocusedRouteName();

  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
          swipeEnabled: routeName === 'index',
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
