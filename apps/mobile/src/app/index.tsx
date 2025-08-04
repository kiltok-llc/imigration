import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { isOnboardedAtom } from '@/atoms/onboarding';
import { stepIdAtom } from '@/lib/services/i589/steps';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardedAtom);
  const setStepId = useSetAtom(stepIdAtom);

  if (__DEV__) {
    setStepId('eligibility');
    return <Redirect href='/services/i589' />;
  }

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  return <Redirect href='/services' />;
}
