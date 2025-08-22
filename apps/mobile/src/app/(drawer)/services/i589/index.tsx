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
import { StepIcons, Stepper } from '@/components/ui/steps';
import { useServiceId } from '@/hooks/use-service-id';
import { useT } from '@/hooks/use-t';
import { STEPS } from '@/lib/services/i589/steps';

export default function I589() {
  const t = useT();
  const serviceId = useServiceId();
  const router = useRouter();
  const stepId = useAtomValue(stepAtom({ serviceId }));
  const stepState = useAtomValue(stepStateAtom({ serviceId, stepId }));

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${serviceId}.progress.screenTitle`),
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
            <Stepper stepId={stepId} steps={STEPS} />
            <View style={tw`gap-2`}>
              <TransText
                i18nKey={`services.${serviceId}.${stepId}.title`}
                style={tw`text-center font-bold`}
                variant='headlineMedium'
              />
              <TransText
                i18nKey={`services.${serviceId}.${stepId}.description`}
                style={tw`text-center`}
                variant='titleSmall'
              />
            </View>
            <StepIcons cols={4} stepId={stepId} steps={STEPS} />
          </Surface>
        </ScrollView>
        <SafeAreaView edges={{ bottom: 'maximum' }} style={tw`p-4`}>
          <TransButton
            contentStyle={tw`flex-row-reverse`}
            context={stepState}
            i18nKey={`services.progress.next`}
            icon='arrow-right'
            mode='contained'
            onPress={() => router.navigate(`/services/${serviceId}/${stepId}`)}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
