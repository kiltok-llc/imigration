'use client';

import { ChevronDownIcon, LogOutIcon, SidebarIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Breadcrumbs } from '@/components/app/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CurrentNamedAvatar,
  NamedAvatarSkeleton,
} from '@/components/user/avatar';

const userMenu = [
  {
    href: '/auth/logout',
    icon: LogOutIcon,
    name: 'Sign out',
  },
];

export function AppShellHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className='bg-background flex h-12 w-full items-center gap-2 border-b px-2'>
      <Button onClick={toggleSidebar} size='icon-sm' variant='ghost'>
        <SidebarIcon />
      </Button>

      <div className='h-full py-3'>
        <Separator orientation='vertical' />
      </div>

      <ErrorBoundary fallback={<Skeleton size='label' />}>
        <Breadcrumbs />
      </ErrorBoundary>

      <div className='flex-1' />

      <UserMenu />
    </header>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <Suspense fallback={<NamedAvatarSkeleton />}>
            <CurrentNamedAvatar />
          </Suspense>

          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' collisionPadding={4}>
        <DropdownMenuGroup>
          {userMenu.map((item) => (
            <DropdownMenuItem asChild key={item.name}>
              <Link href={item.href}>
                <item.icon className='size-5' />

                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
