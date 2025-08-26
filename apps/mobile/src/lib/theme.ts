import { DefaultTheme } from '@react-navigation/native';
import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    background: '#f5f5f5',

    onPrimary: '#ffffff',
    onPrimaryContainer: '#001b3c',
    primary: '#223a5f',
    primaryContainer: '#d5e3ff',

    onSecondary: '#ffffff',
    onSecondaryContainer: '#2d1e00',
    secondary: '#c29a3c',
    secondaryContainer: '#ffdea6',

    success: '#39983e',
    successContainer: '#caefcc',
  },
  roundness: 2,
} as const;

export type Theme = typeof theme;

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    background: theme.colors.background,
    border: theme.colors.outline,
    card: theme.colors.surface,
    notification: theme.colors.error,
    primary: theme.colors.primary,
    text: theme.colors.onSurface,
  },
  dark: false,
} as const;
