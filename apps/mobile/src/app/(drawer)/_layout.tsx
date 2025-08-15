import { Drawer as ExpoDrawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';

import { Drawer } from '@/components/layouts/drawer';

export default function DrawerLayout() {
  const { t } = useTranslation();

  return (
    <Drawer>
      <ExpoDrawer.Screen
        name='services'
        options={{
          drawerLabel: t('services.drawerLabel'),
        }}
      />
      <ExpoDrawer.Screen
        name='settings'
        options={{
          drawerLabel: t('settings.drawerLabel'),
        }}
      />
    </Drawer>
  );
}
