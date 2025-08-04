import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/ui/quiz/layout';

export default function EligibilityLayout() {
  const { t } = useTranslation();

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
