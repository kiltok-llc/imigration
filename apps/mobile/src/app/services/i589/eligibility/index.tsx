import { Redirect } from "expo-router";

import { useLastVisitedRouteName } from '@/providers/route-sequence';

export default function EligibilityScreen() {
  const [lastVisitedRoute] = useLastVisitedRouteName();

  return <Redirect href={`./eligibility/${lastVisitedRoute}`} />;
}