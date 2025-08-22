import { HeaderButton } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { useState } from 'react';
import { Icon, Menu } from 'react-native-paper';
import { toast } from 'sonner-native';

import { stepAtom } from '@/atoms/step-atom';
import { FadeSlot } from '@/components/fade-slot';
import { QuizLayout } from '@/components/quiz/layout';
import { Trans } from '@/components/trans';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { useT } from '@/hooks/use-t';
import { childIdsAtom } from '@/lib/data/child';
import { maritalStatusAtom } from '@/lib/data/marriage';
import { QuizProvider } from '@/lib/quiz';
import { RoutesProvider } from '@/providers/routes';

export default function InfoLayout() {
  const serviceId = useServiceId();
  const stepId = useStepId();
  const t = useT();
  const router = useRouter();
  const maritalStatus = useAtomValue(maritalStatusAtom);
  const childIds = useAtomValue(childIdsAtom);
  const setStep = useSetAtom(stepAtom({ serviceId }));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <Menu
              anchor={
                <HeaderButton
                  accessibilityLabel='Show navigation enu'
                  onPress={() => setMenuOpen(true)}
                >
                  <Icon color={tintColor} size={24} source='dots-horizontal' />
                </HeaderButton>
              }
              onDismiss={() => setMenuOpen(false)}
              visible={menuOpen}
            >
              <Menu.Item
                leadingIcon='content-save'
                onPress={() => {
                  router.dismissTo(`/services/${serviceId}`);
                  toast.success(t('quiz.toast.saved'));
                  setMenuOpen(false);
                }}
                title={<Trans i18nKey={`quiz.menu.save-exit`} />}
              />
            </Menu>
          ),
          title: t(`services.${serviceId}.${stepId}.screenTitle`),
        }}
      />
      <RoutesProvider
        onComplete={() => {
          setStep('statement');
          router.dismissTo(`/services/${serviceId}`);
          router.replace(`/services/${serviceId}?confetti=true`);
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
