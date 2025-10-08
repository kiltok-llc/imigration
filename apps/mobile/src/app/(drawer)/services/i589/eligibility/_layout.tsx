import { router, Stack } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useTimeout } from 'usehooks-ts';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { QuizProvider } from '@/lib/quiz/provider';
import { RoutesProvider } from '@/lib/routes';
import { isStepStartedAtom } from '@/lib/step';
import { useT } from '@/lib/translation';

export default function EligibilityLayout() {
  const [_services, service = '', step = ''] = useLocalSegments();
  const t = useT();
  const setStarted = useSetAtom(isStepStartedAtom({ service, step }));

  useTimeout(() => setStarted(true), 5000);

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${service}.eligibility.screenTitle`),
        }}
      />
      <RoutesProvider
        onComplete={() =>
          router.navigate(`/services/${service}/eligible?confetti=true`)
        }
        routes={[
          'physical-presence',
          'reason-for-leaving',
          'arrival-date',
          'previous-applications',
          'country-of-origin',
        ]}
      >
        <QuizProvider>
          <QuizLayout>
            <FadeSlot />
          </QuizLayout>
        </QuizProvider>
      </RoutesProvider>
    </>
  );
}

export { QuizErrorFallback as ErrorBoundary } from '@/components/quiz/error';
