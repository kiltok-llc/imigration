import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { userDataFamily } from '@/lib/data/user';

export default function InfoLayout() {
  const { t } = useTranslation();
  const maritalStatus = useAtomValue(userDataFamily('maritalStatus'));
  const numberOfChildren = useAtomValue(userDataFamily('numberOfChildren'));

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
          'intro',
          'personal-information/name-and-aliases',
          'personal-information/demographics-and-birth',
          'personal-information/language-proficiency',
          'residence/current-address',
          'residence/previous-addresses',
          'education/school-information',
          'employment/employment-history',
          'family-status/marital-and-children',
          ...(maritalStatus === 'single'
            ? []
            : ['family-status/spouse-information']),
          ...(numberOfChildren && numberOfChildren > 0
            ? ['children/children-details']
            : []),
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

export { QuizErrorFallback as ErrorBoundary } from '@/components/quiz/layout';
