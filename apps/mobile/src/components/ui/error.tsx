import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ErrorBoundaryProps } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ErrorBoundaryProps as ReactErrorBoundaryProps } from 'react-error-boundary';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { TransButton, TransText } from '@/components/trans';

export function ErrorFallback({
  children,
  error,
  retry,
}: PropsWithChildren<ErrorBoundaryProps> & ReactErrorBoundaryProps) {
  const theme = useTheme();

  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={tw`grow`}
      style={tw`flex-1`}
    >
      <SafeAreaView
        edges={{ bottom: 'maximum', top: 'maximum' }}
        style={tw`flex-1 items-center justify-center gap-8 p-4`}
      >
        <MaterialCommunityIcons
          color={theme.colors.error}
          name='alert-circle'
          size={72}
        />

        <TransText
          i18nKey='error.title'
          style={tw`text-center`}
          variant='headlineSmall'
        />

        <TransText
          i18nKey='error.message'
          style={tw`text-center`}
          values={{ message: error.message }}
          variant='bodyLarge'
        />

        <TransButton i18nKey='error.retry' mode='text' onPress={retry} />

        {children}
      </SafeAreaView>
    </ScrollView>
  );
}
