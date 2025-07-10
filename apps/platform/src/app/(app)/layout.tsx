import {
  dehydrate,
  HydrationBoundary as QueryHydrationBoundary,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';

import { AppShellHeader } from '@/components/app/shell';
import { AppShellSidebar } from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserIdProvider } from '@/lib/app-context';
import { getSessionOrRedirect } from '@/lib/auth';
import { makeQueryClient } from '@/lib/query';
import { userQueryOptions } from '@/queries/user';

export default async function AppLayout({ children }: PropsWithChildren) {
  // shadcn sidebar state cookie
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const session = await getSessionOrRedirect();

  // prefetch queries
  const queryClient = makeQueryClient();
  void queryClient.prefetchQuery(userQueryOptions(session.user.id));

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <UserIdProvider value={session.user.id}>
        <SidebarProvider
          className='flex min-w-0 flex-1'
          defaultOpen={sidebarOpen}
        >
          <AppShellSidebar />

          <div className='flex min-w-0 flex-1 flex-col'>
            <AppShellHeader />

            <main className='@container/main flex min-w-0 flex-1 flex-col overflow-hidden'>
              {children}
            </main>
          </div>
        </SidebarProvider>
      </UserIdProvider>
    </QueryHydrationBoundary>
  );
}
