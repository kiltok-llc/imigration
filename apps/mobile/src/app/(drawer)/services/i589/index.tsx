import { Stack, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { useServiceStepAtom } from '@/atoms/service-step-family';
import { TransButton, TransText } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { StepIcons, Stepper } from '@/components/ui/steps';
import { STEPS } from '@/lib/services/i589/steps';

export default function I589() {
  const { t } = useTranslation();
  const router = useRouter();
  const stepId = useAtomValue(useServiceStepAtom());

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: t('services.i589.progress.headerTitle'),
        }}
      />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`my-20 h-full w-full flex-1 gap-10 p-8 pt-10`}>
            <Stepper stepId={stepId} steps={STEPS} />
            <View style={tw`gap-2`}>
              <TransText
                i18nKey={`services.i589.${stepId}.title`}
                style={tw`text-center font-bold`}
                variant='headlineMedium'
              />
              <TransText
                i18nKey={`services.i589.${stepId}.description`}
                style={tw`text-center`}
                variant='titleSmall'
              />
            </View>
            <StepIcons stepId={stepId} steps={STEPS} style={tw`my-auto`} />
          </Surface>
          <TransButton
            contentStyle={tw`flex-row-reverse`}
            i18nKey='next'
            icon='arrow-right'
            mode='contained'
            onPress={() => {
              router.push(`/services/i589/${stepId}`);
            }}
          />
        </Container>
      </SafeAreaView>
    </>
  );
}
