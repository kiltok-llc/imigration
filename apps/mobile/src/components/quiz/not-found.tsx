import { Redirect } from 'expo-router';

import { useRouteUrls } from '@/providers/routes';

export function QuizRouteNotFound() {
  const routes = useRouteUrls();

  console.warn(
    `Redirecting to first route (requested route not found!): ${routes[0]}`
  );

  return <Redirect href={`./${routes[0]}`} />;
}
