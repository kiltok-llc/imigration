import { MD3LightTheme, MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
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
  },
  roundness: 2,
};
