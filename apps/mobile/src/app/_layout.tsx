import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { PaperProvider, useTheme } from 'react-native-paper';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';

import '@/polyfill';
import Toast from 'react-native-toast-message';
import tw, { useDeviceContext } from 'twrnc';

import { SplashScreenBarrier } from '@/components/splash-screen-barrier';
import { env } from '@/env';
import { theme } from '@/lib/paper-theme';
import { LanguageProvider } from '@/providers/language';
import { QueryProvider } from '@/providers/query';
import { TRPCProvider } from '@/providers/trpc';

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

void SystemUI.setBackgroundColorAsync(theme.colors?.background ?? null);

function RootLayout() {
  useDeviceContext(tw);

  return (
    <PaperProvider theme={theme}>
      <ReducedMotionConfig mode={ReduceMotion.Never} />
      <QueryProvider>
        <TRPCProvider>
          <LanguageProvider>
            <SplashScreenBarrier>
              <StackWrapper />
            </SplashScreenBarrier>
            <Toast />
          </LanguageProvider>
        </TRPCProvider>
      </QueryProvider>
    </PaperProvider>
  );
}

/**
 * Wrap the Stack component so that we can use PaperProvider
 */
function StackWrapper() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        title: '',
      }}
    />
  );
}

export { ErrorBoundary } from '@/components/ui/error';

export default Sentry.wrap(RootLayout);
