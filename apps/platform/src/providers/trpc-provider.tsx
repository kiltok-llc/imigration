'use client';

import { AppRouter } from '@repo/api';
import { useQueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { PropsWithChildren } from 'react';
import superjson from 'superjson';

import { env } from '@/env';

const { TRPCProvider: TRPCClientProvider, useTRPC } =
  createTRPCContext<AppRouter>();

export { useTRPC };

function getTrpcUrl() {
  if (typeof window !== 'undefined') {
    return '/api/trpc';
  }
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}/api/trpc`;
  }
  return 'http://localhost:3000/api/trpc';
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: getTrpcUrl(),
    }),
  ],
});

export function TrpcProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  return (
    <TRPCClientProvider queryClient={queryClient} trpcClient={trpcClient}>
      {children}
    </TRPCClientProvider>
  );
}
