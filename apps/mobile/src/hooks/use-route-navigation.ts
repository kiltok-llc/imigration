import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useRouteName } from '@/hooks/use-route';

export const useRouteNavigation = (routes: string[]) => {
  const router = useRouter();
  const routeName = useRouteName();
  const routeIdx = routes.indexOf(routeName);

  const incrementRoute = useCallback((update: number) => {
    if (routeIdx === -1) {
      console.warn(`Current route ${routeName} is not in the defined routes list.`);
      return;
    }

    const nextRouteIdx = routeIdx + update;
    const nextRouteName = routes[nextRouteIdx];
    if (!nextRouteName) {
      console.warn(`Next route index out of bounds: ${nextRouteIdx}.`);
      return;
    }

    console.log(`Navigating to ${nextRouteName} from ${routeName}`);
    router.replace(`./${nextRouteName}`);
  }, [routeIdx, routeName, routes, router]);

  const nextRoute = useCallback(() => incrementRoute(1), [incrementRoute]);
  const prevRoute = useCallback(() => incrementRoute(-1), [incrementRoute]);

  return {
    isFirstRoute: routeIdx === 0,
    isLastRoute: routeIdx === routes.length - 1,
    nextRoute,
    prevRoute,
  };
};

