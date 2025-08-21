import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useQuizRouteAtom } from '@/atoms/quiz-route-family';
import { useRouteUrls } from '@/providers/routes';

export function SavedQuizRouteRedirect() {
  const routes = useRouteUrls();
  const savedUrl = useAtomValue(useQuizRouteAtom());
  const route = savedUrl && routes.includes(savedUrl) ? savedUrl : routes[0];

  if (route) {
    console.log(`Redirecting to saved route: ${route}`);

    return <Redirect href={`./${route}`} relativeToDirectory={true} />;
  }

  console.warn(`No valid route found to redirect to.`);
  return <Redirect href='/' />;
}
