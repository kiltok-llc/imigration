import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { isOnboardingCompleteAtom } from '@/atoms/is-onboarding-complete-atom';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardingCompleteAtom);

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  if (__DEV__) {
    return <Redirect href='/services/i589' />;
  }

  return <Redirect href='/services' />;
}
