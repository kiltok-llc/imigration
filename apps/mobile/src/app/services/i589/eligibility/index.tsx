import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { savedQuizRouteAtom } from '@/lib/services/i589/eligibility';

export default function Eligibility() {
  const savedQuizRoute = useAtomValue(savedQuizRouteAtom);

  console.log(`Redirecting to saved route: ${savedQuizRoute}`);

  return <Redirect href={`./eligibility/${savedQuizRoute}`} />;
}
