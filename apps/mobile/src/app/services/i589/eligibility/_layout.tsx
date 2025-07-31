import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';

import { FadeSlot } from '@/components/fade-slot';
import { QuizHeader } from '@/components/ui/quiz';
import { useFocusedRouteName } from '@/hooks/use-route';
import { RoutesProvider, useRoutes } from '@/providers/route-sequence';

const ROUTES = [
  'physical-presence',
  'reason-for-leaving',
  'arrival-date',
  'previous-applications',
  'criminal-history',
  'country-of-origin',
];

export default function EligibilityLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{
        title: t('services.i589.eligibility.screenTitle'),
      }} />
      <RoutesProvider persistenceKey="services.i589.eligibility.route" routes={ROUTES}>
        <View style={tw`flex-1`}>
          <EligibilityQuizHeader />
          <FadeSlot />
        </View>
      </RoutesProvider>
    </>
  );
}

function EligibilityQuizHeader() {
  const routeName = useFocusedRouteName();
  const routes = useRoutes();
  const routeIdx = routes.indexOf(routeName);
  const nextRouteName = routes[routeIdx + 1];
  const { t } = useTranslation();

  return (
    <QuizHeader
      current={routeIdx + 1}
      nextTitle={nextRouteName ? t(`services.i589.eligibility.${nextRouteName}.title`) : undefined}
      title={t(`services.i589.eligibility.${routeName}.title`)}
      total={routes.length}
    />
  );
}
