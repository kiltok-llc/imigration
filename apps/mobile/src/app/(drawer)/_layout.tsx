import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Drawer as ExpoDrawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';

import { Drawer } from '@/components/drawer';

export default function DrawerLayout() {
  const { t } = useTranslation();

  return (
    <Drawer>
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
