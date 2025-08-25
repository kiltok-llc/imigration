import type { AppRouter } from '@repo/api';

import { useQueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { PropsWithChildren } from 'react';
import superjson from 'superjson';

import { env } from '@/env';
import { supabase } from '@/lib/supabase/client';

export const {
  TRPCProvider: TRPCContextProvider,
  useTRPC,
  useTRPCClient,
} = createTRPCContext<AppRouter>();

export function TRPCProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  return (
    <TRPCContextProvider queryClient={queryClient} trpcClient={trpcClient}>
      {children}
    </TRPCContextProvider>
  );
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      headers: getHeaders,
      transformer: superjson,
      url: env.EXPO_PUBLIC_TRPC_URL,
    }),
  ],
});

async function getHeaders() {
  const headers: Record<string, string> = {};
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session !== null) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}
