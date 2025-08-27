import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { isOnboardingCompleteAtom } from '@/lib/onboarding';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardingCompleteAtom);

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  if (__DEV__) {
    return <Redirect href='/settings' />;
  }

  return <Redirect href='/services' />;
}
