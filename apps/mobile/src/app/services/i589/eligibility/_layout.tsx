import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { FadeSlot } from '@/components/fade-slot';
import { QuizHeader } from '@/components/ui/quiz';
import { useFocusedRouteName } from '@/hooks/use-focused-route-name';
import { RoutesProvider, useFocusedRouteIdx, useNextRouteName, useRoutes } from '@/providers/route-sequence';

const ROUTES = [
  'physically-in-us',
  'left-because-of-harm',
  'arrived-within-last-year',
  'applied-before',
  'convicted-serious-crime',
  'from-safe-country',
];

export default function EligibilityQuizLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{
        title: t('services.i589.steps.eligibility.quiz.screenTitle'),
      }} />
        <RoutesProvider persistenceKey='services.i589.steps.eligibility.quiz.route' routes={ROUTES}>
          <ElgibilityQuiz />
        </RoutesProvider>
    </>
  );
}

function ElgibilityQuiz() {
  const routeIdx = useFocusedRouteIdx();
  const routeId = useFocusedRouteName();
  const nextRouteId = useNextRouteName();
  const routes = useRoutes();
  const { t } = useTranslation();

  return (
    <View>
      <QuizHeader
        current={routeIdx + 1}
        nextTitle={nextRouteId ? t(`services.i589.steps.eligibility.quiz.pages.${nextRouteId}.title`) : undefined}
        title={t(`services.i589.steps.eligibility.quiz.pages.${routeId}.title`)}
        total={routes.length}
      />
      <FadeSlot />
    </View>
  )
}
