import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useT } from '@/hooks/use-t';
import { childIdsAtom } from '@/lib/data/child';
import { maritalStatusAtom } from '@/lib/data/marriage';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function InfoLayout() {
  const t = useT();
  const maritalStatus = useAtomValue(maritalStatusAtom);
  const childIds = useAtomValue(childIdsAtom);

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
          ...(maritalStatus === 'married'
            ? ['immigration-status?context=spouse']
            : []),
          ...childIds.map(
            (id, index) =>
              `immigration-status?context=child&id=${id}&count=${index + 1}`
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
