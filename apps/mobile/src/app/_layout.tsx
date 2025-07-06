import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { PaperProvider, useTheme } from 'react-native-paper';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import '@/polyfill';
import tw, { useDeviceContext } from 'twrnc';

import { SplashScreenBarrier } from '@/components/splash-screen-barrier';
import { theme } from '@/lib/paper-theme';
import { LanguageProvider } from '@/providers/language';
import { QueryProvider } from '@/providers/query';
import { TRPCProvider } from '@/providers/trpc';

Sentry.init({
  dsn: 'https://3276092ac038c5c86be1aaa05983ed5b@o4509602609233920.ingest.us.sentry.io/4509602632040448',

  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  replaysOnErrorSampleRate: 1,
  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

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
