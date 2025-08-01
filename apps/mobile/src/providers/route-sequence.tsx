import { useRouter } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { createRequiredContext, useRequiredContext } from '@/hooks/use-required-context';
import { useFocusedRouteName, useRouteName } from '@/hooks/use-route';
import { storage } from '@/lib/mmkv';

const RoutesContext = createRequiredContext<{
  persistenceKey: string,
  routes: string[],
}>();

export const useRoutes = () => useRequiredContext(RoutesContext).routes;

const usePersistenceKey = () => useRequiredContext(RoutesContext).persistenceKey;

export const useLastVisitedRouteName = () => useMMKVString(usePersistenceKey(), storage);

// Must be called from the child route, NOT the layout.
export const useNextRouteName = () => {
  const routeName = useRouteName();
  const routes = useRoutes();
  const routeIdx = routes.indexOf(routeName);
  if (routeIdx === -1) {
    return;
  }

  return routes[routeIdx + 1];
};

export const useRouteSequenceNavigation = () => {
  const router = useRouter();
  const routeName = useRouteName();
  const routes = useRoutes();
  const routeIdx = routes.indexOf(routeName);

  const incrementRoute = (update: number) => {
    if (routeIdx === -1) {
      return;
    }

    const nextRouteIdx = routeIdx + update;
    if (nextRouteIdx === -1) {
      router.back();
    }

    const nextRouteName = routes[nextRouteIdx];
    if (nextRouteName) {
      router.push(`./${nextRouteName}`);
    }
  }

  return [
    () => incrementRoute(1),
    () => incrementRoute(-1)
  ] as const;
}

export function RoutesProvider(
  {
    children,
    persistenceKey,
    routes,
  }: {
    children: ReactNode;
    persistenceKey: string;
    routes: string[];
  },
) {
  const routeName = useFocusedRouteName();
  const [_, setLastVisitedRouteName] = useMMKVString(persistenceKey, storage);

  useEffect(() => {
    if (routes.includes(routeName)) {
      setLastVisitedRouteName(routeName);
    }
  }, [routeName, routes, setLastVisitedRouteName]);

  return (
    <RoutesContext.Provider value={{ persistenceKey, routes }}>
      {children}
    </RoutesContext.Provider>
  );
}