import { router, Stack } from 'expo-router';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useT } from '@/hooks/use-t';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function EligibilityLayout() {
  const t = useT();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.eligibility.screenTitle'),
        }}
      />
      <RoutesProvider
        onComplete={() =>
          router.navigate('/services/i589/eligible?confetti=true')
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
