import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { isOnboardingCompleteAtom } from '@/lib/onboarding';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardingCompleteAtom);
  // const setSavedUrl = useSetAtom(
  //   quizRouteAtom({ service: 'i589', step: 'info' })
  // );

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  if (__DEV__) {
    return <Redirect href='/services' />;
  }

  return <Redirect href='/services' />;
}
