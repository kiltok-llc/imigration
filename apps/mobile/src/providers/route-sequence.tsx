import { ReactNode, useEffect } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { useFocusedRouteName } from '@/hooks/use-focused-route-name';
import { createRequiredContext, useRequiredContext } from '@/hooks/use-required-context';
import { storage } from '@/lib/mmkv';

const RoutesContext = createRequiredContext<{
  persistenceKey: string,
  routes: string[],
}>();

export const useRoutes = () => useRequiredContext(RoutesContext).routes;

export const useFocusedRouteIdx = () => useRoutes().indexOf(useFocusedRouteName() as string);

export const useNextRouteIdx = () => useFocusedRouteIdx() + 1;

export const useNextRouteName = () => useRoutes()[useNextRouteIdx()];

const usePersistenceKey = () => useRequiredContext(RoutesContext).persistenceKey;

export const useLastVisitedRouteName = () => useMMKVString(usePersistenceKey(), storage);

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
    if (routes.includes(routeName as string)) {
      setLastVisitedRouteName(routeName);
    }
  }, [routeName, routes, setLastVisitedRouteName]);

  return (
    <RoutesContext.Provider value={{ persistenceKey, routes }}>
      {children}
    </RoutesContext.Provider>
  );
}