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
import { toast } from 'sonner-native';

import { env } from '@/env';
import i18n from '@/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: env.NODE_ENV === 'development' ? false : 2,
    },
  },
  mutationCache: new MutationCache({
    onError(error, _variables, _context, mutation) {
      console.error('Error during mutation:', error);
      // TODO send to sentry

      if (mutation.meta?.errorToastKey) {
        toast.error(i18n.t(mutation.meta.errorToastKey as string), {
          id: `mutation-${mutation.mutationId}`,
        });
      } else {
        toast.dismiss(`mutation-${mutation.mutationId}`);
      }
    },
    onMutate(_variables, mutation) {
      if (mutation.meta?.loadingToastKey) {
        toast.loading(i18n.t(mutation.meta.loadingToastKey as string), {
          id: `mutation-${mutation.mutationId}`,
        });
      }
    },
    onSuccess(_data, _variables, _context, mutation) {
      if (mutation.meta?.successToastKey) {
        toast.success(i18n.t(mutation.meta.successToastKey as string), {
          id: `mutation-${mutation.mutationId}`,
        });
      } else {
        toast.dismiss(`mutation-${mutation.mutationId}`);
      }
    },
  }),
  queryCache: new QueryCache({
    onError(error, query) {
      console.error('Error during query:', error);
      // TODO send to sentry

      if (query.meta?.errorToastKey) {
        toast.error(i18n.t(query.meta.errorToastKey as string));
      }
    },
    onSuccess(_data, query) {
      if (query.meta?.successToastKey) {
        toast.success(i18n.t(query.meta.successToastKey as string));
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
