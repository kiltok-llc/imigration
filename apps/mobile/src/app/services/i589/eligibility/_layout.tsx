import { Stack } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';

import { FadeSlot } from '@/components/fade-slot';
import { EligibilityQuizRoutesProvider, useEligibilityQuizRoutes } from '@/components/ui/eligibility';
import { QuizHeader } from '@/components/ui/quiz';
import { useFocusedRouteName } from '@/hooks/use-route';
import { savedQuizRouteAtom } from '@/lib/services/i589/eligibility';


export default function EligibilityLayout() {
  const { t } = useTranslation();
  const setSavedQuizRoute = useSetAtom(savedQuizRouteAtom);

  return (
    <>
      <Stack.Screen options={{
        title: t('services.i589.eligibility.screenTitle'),
      }} />
      <EligibilityQuizRoutesProvider
        onSaveFocusedRoute={setSavedQuizRoute}
        routes={[
          'physical-presence',
          'reason-for-leaving',
          'arrival-date',
          'previous-applications',
          'criminal-history',
          'country-of-origin',
        ]}
      >
        <View style={tw`flex-1`}>
          <EligibilityQuizHeader />
          <FadeSlot />
        </View>
      </EligibilityQuizRoutesProvider>
    </>
  );
}

function EligibilityQuizHeader() {
  const routeName = useFocusedRouteName();
  const routes = useEligibilityQuizRoutes();
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
