import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useSegments } from 'expo-router';
import { Drawer as ExpoDrawer } from 'expo-router/drawer';

import { Drawer } from '@/components/drawer';
import { useT } from '@/hooks/use-t';

export default function DrawerLayout() {
  const t = useT();
  const segments = useSegments();

  return (
    <Drawer
      screenOptions={{
        swipeEnabled: segments.length <= 2,
      }}
    >
      <ExpoDrawer.Screen
        name='services'
        options={{
          drawerIcon: (props) => <FontAwesome6 name='suitcase' {...props} />,
          drawerLabel: t('services.drawerLabel'),
        }}
      />
      <ExpoDrawer.Screen
        name='settings'
        options={{
          drawerIcon: (props) => <FontAwesome6 name='gear' {...props} />,
          drawerLabel: t('settings.drawerLabel'),
        }}
      />
    </Drawer>
  );
}
