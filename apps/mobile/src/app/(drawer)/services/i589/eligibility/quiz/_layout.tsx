import { Stack } from 'expo-router';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useT } from '@/hooks/use-t';

export default function EligibilityLayout() {
  const t = useT();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.eligibility.screenTitle'),
        }}
      />
      <QuizLayout
        finalRoute='../eligible'
        routes={[
          'physical-presence',
          'reason-for-leaving',
          'arrival-date',
          'previous-applications',
          'country-of-origin',
        ]}
      >
        <FadeSlot />
      </QuizLayout>
    </>
  );
}

export { QuizErrorFallback as ErrorBoundary } from '@/components/quiz/layout';
