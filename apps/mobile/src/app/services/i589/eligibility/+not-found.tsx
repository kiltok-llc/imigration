import { Redirect, useLocalSearchParams, usePathname } from 'expo-router';

import { useRoutes } from '@/providers/route-sequence';

export default function NotFound() {
  const [firstRouteName] = useRoutes();
  const pathname = usePathname();

  console.log(`Route ${pathname} not found, redirecting to first route: ${firstRouteName}`);

  return <Redirect href={`./${firstRouteName}`} />;
}