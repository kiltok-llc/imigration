import { Entypo, FontAwesome } from '@expo/vector-icons';
import { router, Stack, useRouter } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { ConfettiPortal } from '@/components/confetti-portal';
import { MigriButton } from '@/components/migri/migri-button';
import { MigriTrigger } from '@/components/migri/migri-trigger';
import { TransButton, TransText } from '@/components/trans';
import { Divider } from '@/components/ui/divider';
import { HeaderMenu, HeaderMenuItem } from '@/components/ui/header-menu';
import { Step, StepIcons, Stepper } from '@/components/ui/steps';
import { useService } from '@/hooks/use-service';
import { migriCompletedEncounterIds, useTriggerMigri } from '@/lib/migri';
import { resetQuizPages } from '@/lib/quiz/page';
import { resetQuizRoute } from '@/lib/quiz/route';
import { I589Step, i589StepAtom } from '@/lib/services/i589/step';
import { isStepStartedAtom } from '@/lib/step.ts/is-step-started-atom';
import { useT } from '@/lib/translation';

export const steps: Step[] = [
  {
    Icon: (props) => <Entypo name='help' {...props} />,
    id: 'eligibility',
  },
  {
    Icon: (props) => <Entypo name='info' {...props} />,
    id: 'info',
  },
  {
    Icon: (props) => <Entypo name='modern-mic' {...props} />,
    id: 'statement',
  },
  {
    Icon: (props) => <Entypo name='eye' {...props} />,
    id: 'review',
  },
  {
    Icon: (props) => <Entypo name='clock' {...props} />,
    id: 'waiting',
  },
  {
    Icon: (props) => <Entypo name='users' {...props} />,
    id: 'interview',
  },
  {
    Icon: (props) => <FontAwesome name='gavel' {...props} />,
    id: 'decision',
  },
  {
    Icon: (props) => <Entypo name='documents' {...props} />,
    id: 'appeal',
  },
];

export default function I589() {
  const t = useT();
  const service = useService();
  const router = useRouter();
  const [step, setStep] = useAtom(i589StepAtom);
  const isStarted = useAtomValue(isStepStartedAtom({ service, step }));

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: (props) => <I589Menu {...props} />,
          title: t(`services.${service}.progress.screenTitle`),
        }}
      />
      <ConfettiPortal />
      <MigriTrigger id={`services.${service}.${step}`} type='talk' />
      <View style={tw`flex-1`}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={tw`grow justify-center`}
          scrollsToTop={false}
          style={tw`flex-1`}
        >
          <Surface style={tw`mx-4 gap-14 p-8`}>
            <Stepper stepId={step} steps={steps} />
            <View style={tw`gap-2`}>
              <TransText
                i18nKey={`services.${service}.${step}.title`}
                style={tw`text-center font-bold`}
                variant='headlineMedium'
              />
              <TransText
                i18nKey={`services.${service}.${step}.description`}
                style={tw`text-center`}
                variant='titleSmall'
              />
            </View>
            <StepIcons
              cols={4}
              onPress={__DEV__ ? (id) => setStep(id as I589Step) : undefined}
              stepId={step}
              steps={steps}
            />
          </Surface>
        </ScrollView>
        <SafeAreaView
          edges={{ bottom: 'maximum' }}
          style={tw`flex-row gap-4 p-4`}
        >
          <View style={tw`flex-1`}>
            <TransButton
              contentStyle={tw`flex-row-reverse`}
              i18nKey={
                isStarted
                  ? 'services.progress.continue'
                  : 'services.progress.start'
              }
              icon='arrow-right'
              mode='contained'
              onPress={() => router.navigate(`/services/${service}/${step}`)}
            />
          </View>
          <MigriButton id={`services.${service}.${step}`} />
        </SafeAreaView>
      </View>
    </>
  );
}

function I589Menu({ tintColor }: { tintColor?: string }) {
  const service = useService();
  const step = useAtomValue(i589StepAtom);

  return (
    <HeaderMenu tintColor={tintColor}>
      {['review', 'statement'].includes(step) && (
        <HeaderMenuItem
          i18nKey={`services.${service}.menu.revise.info`}
          leadingIcon='note-edit'
          onPress={() => {
            resetQuizPages({ service, step: 'info' });
            resetQuizRoute({ service, step: 'info' });
            router.navigate(`/services/${service}/info`);
          }}
        />
      )}
      {step === 'review' && (
        <HeaderMenuItem
          i18nKey={`services.${service}.menu.revise.statement`}
          leadingIcon='account-edit'
          onPress={() => {
            resetQuizPages({ service, step: 'statement' });
            resetQuizRoute({ service, step: 'statement' });
            router.navigate(`/services/${service}/statement`);
          }}
        />
      )}
      {['info', 'statement'].includes(step) && <Divider />}
      <MigriHeaderIcons />
    </HeaderMenu>
  );
}

function MigriHeaderIcons() {
  const service = useService();
  const steps = ['eligibility', 'info', 'statement', 'review'] as const;
  const completedIds = useAtomValue(migriCompletedEncounterIds);
  const triggerMigri = useTriggerMigri();

  return steps
    .filter((step) => completedIds.has(`${service}.${step}`))
    .map((step) => (
      <HeaderMenuItem
        i18nKey={`services.${service}.menu.migri.${step}`}
        key={step}
        onPress={() => {
          triggerMigri({
            id: `services.${service}.${step}`,
            once: false,
            skipMissing: false,
            type: 'talk',
          });
        }}
      />
    ));
}
