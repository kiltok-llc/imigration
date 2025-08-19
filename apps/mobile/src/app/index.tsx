import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { isOnboardedAtom } from '@/atoms/is-onboarding-atom';
import { quizRouteFamily } from '@/atoms/quiz-route-family';

export default function Root() {
  const isOnboarded = useAtomValue(isOnboardedAtom);
  const setSavedQuizRoute = useSetAtom(
    quizRouteFamily({ quizId: 'info', serviceId: 'i589' })
  );

  if (!isOnboarded) {
    return <Redirect href='/onboarding' />;
  }

  if (__DEV__) {
    setSavedQuizRoute('immigration-status?context=spouse');
    return <Redirect href='/services/i589/info' />;
  }

  return <Redirect href='/services' />;
}
