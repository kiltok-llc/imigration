import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { quizRouteAtom } from '@/atoms/quiz-route-atom';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { useRouteUrls } from '@/providers/routes';

export function SavedQuizRouteRedirect() {
  const serviceId = useServiceId();
  const stepId = useStepId();
  const routes = useRouteUrls();
  const savedUrl = useAtomValue(quizRouteAtom({ serviceId, stepId }));
  const route = savedUrl && routes.includes(savedUrl) ? savedUrl : routes[0];

  if (route) {
    console.log(`Redirecting to saved route: ${route}`);

    return <Redirect href={`./${route}`} relativeToDirectory={true} />;
  }

  console.warn(`No valid route found to redirect to.`);
  return <Redirect href='/' />;
}
