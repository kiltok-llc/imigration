import { Stack, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { StepIcons, Stepper } from '@/components/ui/steps';
import { incrementStepAtom, stepIdAtom, stepsAtom } from '@/lib/services/i589/steps';

export default function I589ProgressScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const stepId = useAtomValue(stepIdAtom);
  const steps = useAtomValue(stepsAtom);
  const incrementStep = useSetAtom(incrementStepAtom);

  return (
    <>
      <Stack.Screen options={{
        title: t('services.i589.progress.screenTitle'),
      }} />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`flex-1 p-8 pt-10 my-20 gap-10 w-full h-full`}>
            <Stepper stepId={stepId} steps={steps} />
            <View style={tw`gap-2`}>
              <Text style={tw`font-bold text-center`} variant="headlineMedium">
                <Trans i18nKey={`services.i589.steps.${stepId}.title`} />
              </Text>
              <Text style={tw`text-center`} variant="titleSmall">
                <Trans i18nKey={`services.i589.steps.${stepId}.description`} />
              </Text>
            </View>
            <StepIcons serviceId='i589' stepId={stepId} steps={steps} style={tw`my-auto`} />
          </Surface>
          <Button mode="contained" onPress={() => router.push('/services/i589/eligibility')} style={tw`mt-auto`}>
            <Trans i18nKey="next" />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}
