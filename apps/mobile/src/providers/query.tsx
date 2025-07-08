import type { AppStateStatus } from 'react-native';

import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  focusManager,
  MutationCache,
  onlineManager,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { addNetworkStateListener } from 'expo-network';
import { PropsWithChildren, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import { env } from '@/env';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: env.NODE_ENV === 'development' ? 3000 : false,
      retry: env.NODE_ENV === 'development' ? false : 2,
    },
  },
  mutationCache: new MutationCache({
    onError(error, _variables, _context, mutation) {
      console.error('Mutation Error', error);

      if (mutation.meta?.errorToast) {
        Toast.show({
          text1: 'Application Error',
          text2: mutation.meta.errorToast as string,
          type: 'error',
        });
      }
    },
  }),
  queryCache: new QueryCache({
    onError(error, query) {
      console.error('Query Error', error);

      if (query.meta?.errorToast) {
        Toast.show({
          text1: 'Application Error',
          text2: query.meta.errorToast as string,
          type: 'error',
        });
      }
    },
  }),
});

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = addNetworkStateListener(({ isConnected }) => {
    setOnline(!!isConnected);
  });
  return eventSubscription.remove;
});

export function QueryProvider({ children }: PropsWithChildren) {
  useReactQueryDevTools(queryClient);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        if (Platform.OS !== 'web') {
          focusManager.setFocused(status === 'active');
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
