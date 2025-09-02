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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: env.NODE_ENV === 'development' ? false : 2,
    },
  },
  mutationCache: new MutationCache({
    onError(error, _variables, _context, mutation) {
      console.error('Error running mutation:', error);

      if (mutation.meta?.errorToast) {
        toast.error(mutation.meta.errorToast as string, {
          id: `mutation-${mutation.mutationId}`,
        });
      } else {
        toast.dismiss(`mutation-${mutation.mutationId}`);
      }
    },
    onMutate(_variables, mutation) {
      if (mutation.meta?.loadingToast) {
        toast.loading(mutation.meta.loadingToast as string, {
          id: `mutation-${mutation.mutationId}`,
        });
      }
    },
    onSuccess(_data, _variables, _context, mutation) {
      if (mutation.meta?.successToast) {
        toast.success(mutation.meta.successToast as string, {
          id: `mutation-${mutation.mutationId}`,
        });
      } else {
        toast.dismiss(`mutation-${mutation.mutationId}`);
      }
    },
  }),
  queryCache: new QueryCache({
    onError(error, query) {
      console.error('Error running query:', error);

      if (query.meta?.errorToast) {
        toast.error(query.meta.errorToast as string);
      }
    },
    onSuccess(_data, query) {
      if (query.meta?.successToast) {
        toast.success(query.meta.successToast as string);
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
