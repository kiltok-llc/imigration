import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { isOnboardedAtom } from '@/atoms/is-onboarding-atom';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardedAtom);

  if (__DEV__) {
    return (
      <Redirect href='/services/i589/info/quiz/personal-information/demographics-and-birth' />
    );
  }

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  return <Redirect href='/services' />;
}
