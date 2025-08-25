import * as Sentry from '@sentry/react-native';

import '@/i18n';
import { isRunningInExpoGo } from 'expo';
import * as SystemUI from 'expo-system-ui';
import React from 'react';

import '@/polyfill';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider } from 'react-native-paper';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { Toaster } from 'sonner-native';
import tw from 'twrnc';

import { MigriPortal } from '@/components/migri/migri-portal';
import { SplashScreenBarrier } from '@/components/splash-screen-barrier';
import { Stack } from '@/components/stack';
import { env } from '@/env';
import { DevMenuProvider } from '@/hooks/use-dev-menu-items';
import { QueryProvider } from '@/lib/query';
import { theme } from '@/lib/theme';
import { TRPCProvider } from '@/lib/trpc';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://3276092ac038c5c86be1aaa05983ed5b@o4509602609233920.ingest.us.sentry.io/4509602632040448',

  enableNativeFramesTracking: !isRunningInExpoGo(),

  environment: env.EXPO_PUBLIC_SENTRY_ENVIRONMENT ?? env.NODE_ENV,

  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
    navigationIntegration,
  ],

  replaysOnErrorSampleRate: 1,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

void SystemUI.setBackgroundColorAsync(theme.colors.background);

function RootLayout() {
  return (
    <DevMenuProvider>
      <QueryProvider>
        <ReducedMotionConfig mode={ReduceMotion.Never} />
        <TRPCProvider>
          <GestureHandlerRootView style={tw`flex-1`}>
            <KeyboardProvider>
              <PaperProvider theme={theme}>
                <SplashScreenBarrier>
                  <MigriPortal />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  />
                  <Toaster />
                </SplashScreenBarrier>
              </PaperProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </TRPCProvider>
      </QueryProvider>
    </DevMenuProvider>
  );
}

export { ErrorFallback as ErrorBoundary } from '@/components/ui/error';

export default Sentry.wrap(RootLayout);
