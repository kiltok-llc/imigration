import { router, Stack } from 'expo-router';
import { useAtom } from 'jotai';
import { useTimeout } from 'usehooks-ts';

import { stepStateAtom } from '@/atoms/step-state-atom';
import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { useT } from '@/hooks/use-t';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function EligibilityLayout() {
  const service = useService();
  const step = useStep();
  const t = useT();
  const [stepState, setStepState] = useAtom(stepStateAtom({ service, step }));

  useTimeout(
    () => setStepState('active'),
    stepState === 'pending' ? 5000 : null
  );

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
