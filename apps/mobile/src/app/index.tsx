import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { isOnboardedAtom } from '@/atoms/onboarding';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardedAtom);

  if (__DEV__) {
    return <Redirect href='/services' />;
  }

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  return <Redirect href='/services' />;
}
