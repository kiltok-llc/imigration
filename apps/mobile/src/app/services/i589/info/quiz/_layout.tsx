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
      <QuizLayout
        finalRoute='../complete'
        routes={[
          'personal-information/name-and-aliases',
          'personal-information/demographics-and-birth',
          'personal-information/language-proficiency',
          'residence/us-residence-status',
          'residence/current-address',
          'education/school-information',
          'employment/employment-history',
          'family-status/marital-and-children',
          'family-status/spouse-information',
          'children/children-details',
          'identification/passport-information',
          'identification/other-identification',
          'asylum-and-fear/asylum-reasons-and-fear',
          'legal-history/legal-and-affiliations',
          'declaration/final-declaration',
        ]}
      >
        <FadeSlot />
      </QuizLayout>
    </>
  );
}

export { QuizErrorFallback as ErrorBoundary } from '@/components/ui/quiz/layout';
