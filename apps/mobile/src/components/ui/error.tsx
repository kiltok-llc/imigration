import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ErrorBoundaryProps } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ErrorBoundaryProps as ReactErrorBoundaryProps } from 'react-error-boundary';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function ErrorFallback({
  children,
  error,
  retry,
}: PropsWithChildren<ErrorBoundaryProps> & ReactErrorBoundaryProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Container style={tw`flex-1 items-center justify-center gap-8`}>
        <MaterialCommunityIcons
          color={theme.colors.error}
          name='alert-circle'
          size={72}
        />

        <Text style={tw`text-center`} variant='headlineSmall'>
          <Trans i18nKey='error.title' />
        </Text>

        <Text style={tw`text-center`} variant='bodyLarge'>
          <Trans i18nKey='error.message' values={{ message: error.message }} />
        </Text>

        <Button mode='text' onPress={retry}>
          <Trans i18nKey='error.retry' />
        </Button>

        {children}
      </Container>
    </SafeAreaView>
  );
}
