import { Redirect } from 'expo-router';

import { useRouteUrls } from '@/lib/routes';

export function QuizRouteNotFound() {
  const routes = useRouteUrls();
  const route = routes[0] ?? '../';

  console.warn(
    `Redirecting to first route (requested route not found!): ${route}`
  );

  return <Redirect href={`./${route}`} />;
}
