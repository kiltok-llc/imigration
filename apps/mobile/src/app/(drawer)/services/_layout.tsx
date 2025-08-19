import Drawer from 'expo-router/drawer';
import * as React from 'react';

import { Stack } from '@/components/stack';
import { useFocusedRouteName } from '@/hooks/use-route';

export default function DrawerLayout() {
  const routeName = useFocusedRouteName();

  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
          swipeEnabled: routeName === 'index',
        }}
      />
      <Stack />
    </>
  );
}
