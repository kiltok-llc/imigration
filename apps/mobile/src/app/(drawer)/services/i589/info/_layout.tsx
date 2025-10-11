import { Stack, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { toast } from 'sonner-native';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { HeaderMenu, HeaderMenuItem } from '@/components/ui/header-menu';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { childIdsAtom } from '@/lib/data/child';
import { maritalStatusAtom } from '@/lib/data/marriage';
import { QuizProvider } from '@/lib/quiz/provider';
import { RoutesProvider } from '@/lib/routes';
import { i589StepAtom } from '@/lib/services/i589/step';
import { useT } from '@/lib/translation';

export default function InfoLayout() {
  const [_services, service = '', step = ''] = useLocalSegments();
  const t = useT();
  const router = useRouter();
  const maritalStatus = useAtomValue(maritalStatusAtom);
  const childIds = useAtomValue(childIdsAtom);
  const setStep = useSetAtom(i589StepAtom);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: (props) => (
            <HeaderMenu {...props}>
              <HeaderMenuItem
                i18nKey='quiz.menu.save-exit'
                leadingIcon='content-save'
                onPress={() => {
                  router.dismissTo(`/services/${service}`);
                  toast.success(t('quiz.toast.saved'));
                }}
              />
            </HeaderMenu>
          ),
          title: t(`services.${service}.${step}.screenTitle`),
        }}
      />
      <RoutesProvider
        onComplete={() => {
          setStep('statement');
          router.dismissTo(`/services/${service}`);
          router.replace(`/services/${service}?confetti=true`);
        }}
        routes={[
          'intro',
          'personal-information/contact-information',
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
