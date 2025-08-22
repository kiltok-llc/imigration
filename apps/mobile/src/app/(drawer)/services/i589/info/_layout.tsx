import { HeaderButton } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Icon } from 'react-native-paper';

import { useServiceStepAtom } from '@/atoms/service-step-family';
import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { useT } from '@/hooks/use-t';
import { childIdsAtom } from '@/lib/data/child';
import { maritalStatusAtom } from '@/lib/data/marriage';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function InfoLayout() {
  const t = useT();
  const router = useRouter();
  const maritalStatus = useAtomValue(maritalStatusAtom);
  const childIds = useAtomValue(childIdsAtom);
  const setStep = useSetAtom(useServiceStepAtom());

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <HeaderButton
              accessibilityLabel='Show navigation enu'
              onPress={() => console.log('hi')}
            >
              <Icon color={tintColor} size={24} source='dots-horizontal' />
            </HeaderButton>
          ),
          title: t('services.i589.info.screenTitle'),
        }}
      />
      <RoutesProvider
        onComplete={() => {
          setStep('statement');
          router.dismissTo('/services/i589');
          router.replace('/services/i589?confetti=true');
        }}
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
