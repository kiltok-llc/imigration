import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import { useGlobalSearchParams } from 'expo-router';
import { useLayoutEffect, useRef } from 'react';

// The focused route *below* the layout it is called from.
export const useFocusedRouteName = () => {
  const routeName = useNavigationState((state) =>
    getFocusedRouteNameFromRoute(state.routes[state.index]!)
  );
  const lastRouteNameRef = useRef('');

  useLayoutEffect(() => {
    if (routeName) {
      lastRouteNameRef.current = routeName;
    }
  }, [routeName]);

  return routeName ?? lastRouteNameRef.current;
};

export const useFocusedRouteNameWithParams = () => {
  const routeName = useFocusedRouteName();
  const params = new URLSearchParams(
    useGlobalSearchParams<Record<string, string>>()
  );
  if (params.size ?? 0 === 0) {
    return routeName;
  }
  return `${routeName}?${params.toString()}`;
};

/// The current route name.
export const useRouteName = () => useRoute().name;
