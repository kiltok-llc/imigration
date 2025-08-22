import { router, Stack } from 'expo-router';
import { useAtom } from 'jotai';
import { useTimeout } from 'usehooks-ts';

import { stepStateAtom } from '@/atoms/step-state-atom';
import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { useT } from '@/hooks/use-t';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function EligibilityLayout() {
  const serviceId = useServiceId();
  const stepId = useStepId();
  const t = useT();
  const [stepState, setStepState] = useAtom(
    stepStateAtom({ serviceId, stepId })
  );

  useTimeout(
    () => setStepState('active'),
    stepState === 'pending' ? 5000 : null
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${serviceId}.eligibility.screenTitle`),
        }}
      />
      <RoutesProvider
        onComplete={() =>
          router.navigate(`/services/${serviceId}/eligible?confetti=true`)
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
