import Drawer from 'expo-router/drawer';
import * as React from 'react';

import { Stack } from '@/components/stack';
import { useIsIndex } from '@/hooks/use-is-index';

export default function DrawerLayout() {
  const isIndex = useIsIndex();

  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
          swipeEnabled: isIndex,
        }}
      />
      <Stack />
    </>
  );
}
