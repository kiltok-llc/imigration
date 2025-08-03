import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { quizRouteAtom } from '@/lib/quiz/route';
import { useRouteUrls } from '@/lib/routes';

export function SavedQuizRouteRedirect() {
  const service = useService();
  const step = useStep();
  const routes = useRouteUrls();
  const savedUrl = useAtomValue(quizRouteAtom({ service, step }));
  const route = savedUrl && routes.includes(savedUrl) ? savedUrl : routes[0];

  if (route) {
    console.log(`Redirecting to saved route: ${route}`);

    return <Redirect href={`./${route}`} relativeToDirectory={true} />;
  }

  console.warn(`No valid route found to redirect to.`);
  return <Redirect href='/' />;
}
