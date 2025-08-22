import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
} from '@react-navigation/native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

const RoutesContext = createContext<{
  allowedParameters: Set<string>;
  onComplete: () => void;
  routes: string[];
}>({ allowedParameters: new Set(), onComplete: () => {}, routes: [] });
const CurrentRouteContext = createContext<[string, Record<string, string>]>([
  '',
  {},
]);

const useAllowedParameters = () => useContext(RoutesContext).allowedParameters;
export const useRouteUrls = () => useContext(RoutesContext).routes;
export const useIsLastRoute = () => {
  const routes = useRouteUrls();
  const index = useCurrentRouteIndex();
  return index === routes.length - 1;
};
export const useIsFirstRoute = () => {
  const index = useCurrentRouteIndex();
  return index === 0;
};
export const useOnComplete = () => useContext(RoutesContext).onComplete;
export const useCurrentRoute = () => useContext(CurrentRouteContext);
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
  const allowedParameters = useAllowedParameters();
  const params = Object.fromEntries(new URLSearchParams(query ?? ''));
  const filteredParmams = Object.fromEntries(
    Object.entries(params).filter(([key]) => allowedParameters.has(key))
  );
  return [name, filteredParmams] as const;
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
        console.warn(
          `Current route is not in the defined routes list: ${routeUrl}`
        );
        return;
      }

      const index = routeIdx + update;
      const route = routes[index];
      if (!route) {
        console.warn(`Next route index out of bounds: ${index}.`);
        return;
      }

      console.debug(`Changing route: ${routeUrl} -> ${route}`);

      const level = routeUrl.split('/').length - 1;
      const nesting = '../'.repeat(level);
      router.replace(`./${nesting}${route}`);
    },
    [routeIdx, routeUrl, router, routes]
  );
};

const useCurrentRouteInternal = (allowedParameters: Set<string>) => {
  const currentRouteName = useNavigationState((state) =>
    getFocusedRouteNameFromRoute(state.routes[state.index]!)
  );

  const currentParams = useGlobalSearchParams<Record<string, string>>();
  const filteredParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => allowedParameters.has(key))
  );

  // When navigating away from this navigator, we want to keep the return value
  // of this hook the same, so we store it in a ref.
  const routeRef = useRef<[string, Record<string, string>]>(['', {}]);

  if (currentRouteName) {
    routeRef.current = [currentRouteName, filteredParams] as const;
  } else {
    console.log(
      'No focused route name, likely navigating away from navigator.'
    );
  }

  return routeRef.current;
};

export function RoutesProvider({
  children,
  onComplete,
  routes,
}: PropsWithChildren<{
  onComplete: () => void;
  routes: string[];
}>) {
  const allowedParameters = useMemo(
    () =>
      new Set(
        routes.flatMap((route) => {
          const paramIdx = route.indexOf('?');
          if (paramIdx === -1) {
            return [];
          }
          return [...new URLSearchParams(route.slice(paramIdx)).keys()];
        })
      ),
    [routes]
  );

  return (
    <RoutesContext.Provider value={{ allowedParameters, onComplete, routes }}>
      <CurrentRouteContext value={useCurrentRouteInternal(allowedParameters)}>
        {children}
      </CurrentRouteContext>
    </RoutesContext.Provider>
  );
}
