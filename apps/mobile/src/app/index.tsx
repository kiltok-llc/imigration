import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { isOnboardingCompleteAtom } from '@/lib/onboarding';
import { quizRouteAtom } from '@/lib/quiz/route';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardingCompleteAtom);
  const _setSavedUrl = useSetAtom(
    quizRouteAtom({ service: 'i589', step: 'info' })
  );

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  if (__DEV__) {
    return <Redirect href='/services/i589/statement' />;
    // setSavedUrl('personal-information/contact-information');
    // return (
    //   <Redirect href='/services/i589/info/personal-information/contact-information' />
    // );
  }

  return <Redirect href='/services' />;
}
