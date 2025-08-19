import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
} from '@react-navigation/native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { PropsWithChildren, useCallback, useRef } from 'react';

import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useStable } from '@/hooks/use-stable';

const RouteUrlsContext = createRequiredContext<string[]>();
const FinalRouteContext = createRequiredContext<string>();
const CurrentRouteContext =
  createRequiredContext<[string, Record<string, string>]>();

export const useRouteUrls = () => useRequiredContext(RouteUrlsContext);
export const useIsLastRoute = () => {
  const routes = useRouteUrls();
  const index = useCurrentRouteIndex();
  return index === routes.length - 1;
};
export const useIsFirstRoute = () => {
  const index = useCurrentRouteIndex();
  return index === 0;
};
export const useFinalRouteUrl = () => useRequiredContext(FinalRouteContext);
export const useCurrentRoute = () => useRequiredContext(CurrentRouteContext);
export const useCurrentRouteUrl = () => {
  const [name, params] = useCurrentRoute();
  if (Object.keys(params).length === 0) {
    return name;
  }
  return `${name}?${new URLSearchParams(params).toString()}`;
};
export const useCurrentRouteIndex = () => {
  const routes = useRouteUrls();
  const currentRouteUrl = useCurrentRouteUrl();
  return routes.indexOf(currentRouteUrl);
};
export const useNextRoute = () => {
  const nextRouteUrl = useNextRouteUrl();
  const [name, query] = nextRouteUrl?.split('?') ?? [];
  const params = Object.fromEntries(new URLSearchParams(query ?? ''));
  return useStable([name, params] as const);
};
export const useNextRouteUrl = () => {
  const routes = useRouteUrls();
  const index = useCurrentRouteIndex();
  return index > 0 ? routes[index + 1] : undefined;
};
export const useIncrementRoute = () => {
  const routeIdx = useCurrentRouteIndex();
  const routes = useRouteUrls();
  const routeUrl = useCurrentRouteUrl();
  const router = useRouter();

  return useCallback(
    (update: number) => {
      if (routeIdx === -1) {
        console.warn(`Current route is not in the defined routes list.`);
        return;
      }

      const index = routeIdx + update;
      const route = routes[index];
      if (!route) {
        console.warn(`Next route index out of bounds: ${index}.`);
        return;
      }

      console.debug(`Navigating to ${route} from ${routeUrl}`);

      const level = routeUrl.split('/').length - 1;
      const nesting = '../'.repeat(level);
      router.replace(`./${nesting}${route}`);
    },
    [routeIdx, routeUrl, router, routes]
  );
};

const useCurrentRouteInternal = () => {
  const currentRouteName = useNavigationState((state) =>
    getFocusedRouteNameFromRoute(state.routes[state.index]!)
  );

  const currentParams = useGlobalSearchParams<Record<string, string>>();

  // When navigating away from this navigator, we want to keep the return value
  // of this hook the same, so we store it in a ref.
  const routeRef = useRef<[string, Record<string, string>]>(['', {}]);

  if (currentRouteName) {
    routeRef.current = [currentRouteName, currentParams] as const;
  } else {
    console.log(
      'No focused route name, likely navigating away from navigator.'
    );
  }

  return useStable(routeRef.current);
};

export function RoutesProvider({
  children,
  finalRoute,
  routes,
}: PropsWithChildren<{
  finalRoute: string;
  routes: string[];
}>) {
  return (
    <RouteUrlsContext.Provider value={useStable(routes)}>
      <FinalRouteContext.Provider value={finalRoute}>
        <CurrentRouteContext value={useCurrentRouteInternal()}>
          {children}
        </CurrentRouteContext>
      </FinalRouteContext.Provider>
    </RouteUrlsContext.Provider>
  );
}
