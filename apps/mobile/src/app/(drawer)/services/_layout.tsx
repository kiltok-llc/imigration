import Drawer from 'expo-router/drawer';
import * as React from 'react';

import { Stack } from '@/components/layouts/stack';

export default function DrawerLayout() {
  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
      />
      <Stack />
    </>
  );
}
