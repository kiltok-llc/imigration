import { Stack } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/ui/quiz/layout';
import { savedInfoRouteAtom } from '@/lib/services/i589/info';

export default function InfoLayout() {
  const { t } = useTranslation();
  const setSavedQuizRoute = useSetAtom(savedInfoRouteAtom);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.info.screenTitle'),
        }}
      />
      <QuizLayout onSaveFocusedRoute={setSavedQuizRoute} routes={['test']}>
        <FadeSlot />
      </QuizLayout>
    </>
  );
}
