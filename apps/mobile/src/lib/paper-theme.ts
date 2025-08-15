import { MD3LightTheme, MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#f5f5f5',
    onPrimary: '#ffffff',
    primary: '#223A5F',
    secondary: '#c29a3c',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      lineHeight: MD3LightTheme.fonts.titleLarge.lineHeight,
    },
  },
  roundness: 2,
};
