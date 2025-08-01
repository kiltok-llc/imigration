import { Redirect, usePathname } from 'expo-router';

import { useEligibilityQuizRoutes } from '@/components/ui/eligibility';

export default function NotFound() {
  const [firstRouteName] = useEligibilityQuizRoutes();
  const pathname = usePathname();

  console.log(`Route ${pathname} not found, redirecting to first route: ${firstRouteName}`);

  return <Redirect href={`./${firstRouteName}`} />;
}