import { getFocusedRouteNameFromRoute, useNavigationState, useRoute } from '@react-navigation/native';

/// The focused route *below* the layout it is called from.
export const useFocusedRouteName = () => useNavigationState((state) => getFocusedRouteNameFromRoute(state.routes[state.index]!)) ?? '';

/// The current route name.
export const useRouteName = () => useRoute().name;
