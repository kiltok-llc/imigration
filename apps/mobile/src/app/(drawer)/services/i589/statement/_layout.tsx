import { Stack, useRouter } from 'expo-router';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner-native';

import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { HeaderMenu, HeaderMenuItem } from '@/components/ui/header-menu';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { lateApplicationDetailsAtom } from '@/lib/data/asylum';
import { entriesAtom } from '@/lib/data/user';
import { QuizProvider } from '@/lib/quiz/provider';
import { RoutesProvider } from '@/lib/routes';
import { i589StepAtom } from '@/lib/services/i589/step';
import { useT } from '@/lib/translation';

const now = new Date();
const oneYear = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
const cuttoffDate = new Date(now.getTime() - oneYear);

const submissionIsLateAtom = atom((get) => {
  const [mostRecentEntry] = get(entriesAtom)
    .map(({ date }) => date)
    .filter((date) => date !== null)
    .sort((a, b) => b.getTime() - a.getTime());

  if (!mostRecentEntry) {
    return true;
  }

  return mostRecentEntry.getTime() < cuttoffDate.getTime();
});

export default function StatementLayout() {
  const [_services, service = '', step = ''] = useLocalSegments();
  const t = useT();
  const router = useRouter();
  const setStep = useSetAtom(i589StepAtom);
  const submissionIsLate = useAtomValue(submissionIsLateAtom);
  const [lateApplicationDetails, setLateApplicationDetails] = useAtom(
    lateApplicationDetailsAtom
  );

  // Need to reset late application details if entry date is changed
  useEffect(() => {
    if (!submissionIsLate && lateApplicationDetails) {
      setLateApplicationDetails('');
    }
  }, [lateApplicationDetails, setLateApplicationDetails, submissionIsLate]);

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
          setStep('review');
          router.dismissTo(`/services/${service}`);
          router.replace(`/services/${service}?confetti=true`);
        }}
        routes={[
          'intro',
          ...(submissionIsLate ? ['late-application'] : []),
          'harm-and-persecution',
          'fear-of-return',
          'fear-of-torture',
          'international-criminal-history',
          'organizational-affiliations',
          'reasons-for-asylum',
          'previous-applications',
          'international-immigration-history',
          'harm-participation',
          'return-to-country',
          'criminal-history',
          'final-declaration',
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
