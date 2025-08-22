import { Entypo, FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { stepAtom } from '@/atoms/step-atom';
import { stepStateAtom } from '@/atoms/step-state-atom';
import { ConfettiOnDemand } from '@/components/confetti-on-demand';
import { TransButton, TransText } from '@/components/trans';
import { Step, StepIcons, Stepper } from '@/components/ui/steps';
import { useService } from '@/hooks/use-service';
import { useT } from '@/hooks/use-t';

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
  const step = useAtomValue(stepAtom({ service }));
  const stepState = useAtomValue(stepStateAtom({ service, step }));

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${service}.progress.screenTitle`),
        }}
      />
      <ConfettiOnDemand />
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
            <StepIcons cols={4} stepId={step} steps={steps} />
          </Surface>
        </ScrollView>
        <SafeAreaView edges={{ bottom: 'maximum' }} style={tw`p-4`}>
          <TransButton
            contentStyle={tw`flex-row-reverse`}
            context={stepState}
            i18nKey={`services.progress.next`}
            icon='arrow-right'
            mode='contained'
            onPress={() => router.navigate(`/services/${service}/${step}`)}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
