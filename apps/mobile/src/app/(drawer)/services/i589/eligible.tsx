import { router, Stack } from 'expo-router';
import { useSetAtom } from 'jotai';
import { View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { stepAtom } from '@/atoms/step-atom';
import { stepStateAtom } from '@/atoms/step-state-atom';
import { ConfettiOnDemand } from '@/components/confetti-on-demand';
import { TransButton, TransText } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { useServiceId } from '@/hooks/use-service-id';
import { useT } from '@/hooks/use-t';

export default function Eligible() {
  const serviceId = useServiceId();
  const t = useT();
  const setStep = useSetAtom(stepAtom({ serviceId }));
  const setEligibilityStepState = useSetAtom(
    stepStateAtom({ serviceId, stepId: 'eligibility' })
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${serviceId}.eligible.screenTitle`),
        }}
      />
      <ConfettiOnDemand />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`my-20 h-full w-full flex-1 gap-10 p-8 pt-10`}>
            <View style={tw`mb-8 items-center`}>
              <View
                style={tw`mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-500`}
              >
                {/*TODO replace with icon*/}
                <Text style={tw`text-3xl font-bold text-white`}>✓</Text>
              </View>
            </View>

            <View style={tw`gap-4`}>
              <TransText
                i18nKey={`services.${serviceId}.eligible.title`}
                style={tw`text-center font-bold`}
                variant='headlineMedium'
              />
              <TransText
                i18nKey={`services.${serviceId}.eligible.description`}
                style={tw`text-center`}
                variant='bodyLarge'
              />
              <TransText
                i18nKey={`services.${serviceId}.eligible.nextSteps`}
                style={tw`mt-4 text-center`}
                variant='bodyMedium'
              />
            </View>
          </Surface>
          <TransButton
            contentStyle={tw`flex-row-reverse`}
            i18nKey={`services.${serviceId}.eligible.continue`}
            icon='arrow-right'
            onPress={() => {
              setStep('info');
              setEligibilityStepState('completed');
              router.dismissTo(`/services/${serviceId}`);
              router.replace(`/services/${serviceId}`);
            }}
            style={tw`mt-auto`}
          />
        </Container>
      </SafeAreaView>
    </>
  );
}
