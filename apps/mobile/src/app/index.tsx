import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { isOnboardedAtom } from '@/atoms/onboarding';
import { serviceStepFamily } from '@/atoms/service-step-family';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardedAtom);
  const setStepId = useSetAtom(serviceStepFamily('i589'));

  if (__DEV__) {
    setStepId('eligibility');
    return (
      <Redirect href='/services/i589/eligibility' />
    );
  }

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  return <Redirect href='/services' />;
}
