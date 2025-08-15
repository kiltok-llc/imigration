import { Drawer as ExpoDrawer } from 'expo-router/drawer';
import { useTheme } from 'react-native-paper';

export function Drawer() {
  const theme = useTheme();

  return (
    <ExpoDrawer
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        title: '',
      }}
    />
  );
}
