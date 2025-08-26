import { Stack } from 'expo-router';
import Drawer from 'expo-router/drawer';
import * as React from 'react';

export default function ServicesLayout() {
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
