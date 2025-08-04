import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/ui/quiz/layout';

export default function InfoLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.info.screenTitle'),
        }}
      />
      <QuizLayout routes={[]}>
        <FadeSlot />
      </QuizLayout>
    </>
  );
}
