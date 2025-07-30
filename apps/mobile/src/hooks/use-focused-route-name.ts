import {getFocusedRouteNameFromRoute, useNavigationState } from "@react-navigation/native";

export const useFocusedRouteName = () =>
  useNavigationState((state) => getFocusedRouteNameFromRoute(state.routes[state.index]!))
