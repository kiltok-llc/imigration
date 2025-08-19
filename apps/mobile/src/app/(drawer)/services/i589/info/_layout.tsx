import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useT } from '@/hooks/use-t';
import { numberOfChildrenAtom, userDataFamily } from '@/lib/data/user';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function InfoLayout() {
  const t = useT();
  const maritalStatus = useAtomValue(userDataFamily('maritalStatus'));
  const numberOfChildren = useAtomValue(numberOfChildrenAtom);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.info.screenTitle'),
        }}
      />
      <RoutesProvider
        finalRoute='../complete'
        routes={[
          'intro',
          'personal-information/name-and-aliases',
          'personal-information/demographics-and-birth',
          'personal-information/language-proficiency',
          'residence/current-address',
          'residence/previous-addresses',
          'school-information',
          'employment-history',
          'family-status/marital-status',
          'family-status/children-details',
          'family-status/parent-details',
          'family-status/sibling-details',
          'immigration-status?context=client',
          ...(maritalStatus === 'single'
            ? []
            : ['immigration-status?context=spouse']),
          ...Array.from({ length: numberOfChildren }).map(
            (_, i) => `immigration-status?context=child&index=${i}`
          ),
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
