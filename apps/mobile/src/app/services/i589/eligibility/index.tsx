import {Redirect} from "expo-router";

import {useLastVisitedRouteName} from '@/providers/route-sequence';

export default function Eligibility() {
  const [lastVisitedRouteName] = useLastVisitedRouteName();

  console.log(`Redirecting to last visited route: ${lastVisitedRouteName}`);

  return <Redirect href={`./eligibility/${lastVisitedRouteName}`}/>;
}
