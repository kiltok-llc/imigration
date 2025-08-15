import { Stack as ExpoStack } from 'expo-router';
import { ComponentProps } from 'react';
import { useTheme } from 'react-native-paper';

export function Stack({
  screenOptions,
  ...props
}: ComponentProps<typeof ExpoStack>) {
  const theme = useTheme();

  return (
    <ExpoStack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        title: '',
        ...screenOptions,
      }}
      {...props}
    />
  );
}
