import { Stack, useRouter } from 'expo-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { toast } from 'sonner-native';

import { stepAtom } from '@/atoms/step-atom';
import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { HeaderMenu, HeaderMenuItem } from '@/components/ui/header-menu';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { useT } from '@/hooks/use-t';
import { entriesAtom } from '@/lib/data/user';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

const now = new Date();
const oneYear = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
const cuttoffDate = new Date(now.getTime() - oneYear);

const entryIsRecentAtom = atom((get) => {
  const [mostRecentEntry] = get(entriesAtom)
    .map(({ date }) => date)
    .filter((date) => date !== null)
    .sort((a, b) => b.getTime() - a.getTime());

  if (!mostRecentEntry) {
    return false;
  }

  return mostRecentEntry.getTime() >= cuttoffDate.getTime();
});

export default function StatementLayout() {
  const service = useService();
  const step = useStep();
  const t = useT();
  const router = useRouter();
  const setStep = useSetAtom(stepAtom({ service }));
  const entryIsRecent = useAtomValue(entryIsRecentAtom);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <HeaderMenu tintColor={tintColor}>
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
          ...(entryIsRecent ? [] : ['late-application']),
          'harm-and-persecution',
          'fear',
          'fear-of-torture',
          'criminal-history',
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
