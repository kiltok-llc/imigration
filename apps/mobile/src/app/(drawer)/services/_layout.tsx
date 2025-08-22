import Drawer from 'expo-router/drawer';
import * as React from 'react';

import { Stack } from '@/components/stack';

export default function ServicesLayout() {
  return (
    <>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
      />
      <Stack/>
    </>
  );
}
