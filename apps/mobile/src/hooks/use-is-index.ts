import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
} from '@react-navigation/native';

export const useIsIndex = () =>
  useNavigationState(
    (state) =>
      getFocusedRouteNameFromRoute(state.routes[state.index]!) === 'index'
  );
