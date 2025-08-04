import { router, Stack } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  quizAnswersAtom,
  savedQuizRouteAtom,
} from '@/lib/services/i589/eligibility';
import { stepIdAtom } from '@/lib/services/i589/steps';

export default function Eligible() {
  const { t } = useTranslation();
  const resetEligibilityQuiz = useResetAtom(quizAnswersAtom);
  const resetSavedQuizRoute = useResetAtom(savedQuizRouteAtom);
  const setStep = useSetAtom(stepIdAtom);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.eligible.screenTitle'),
        }}
      />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`my-20 h-full w-full flex-1 gap-10 p-8 pt-10`}>
            <View style={tw`mb-8 items-center`}>
              <View
                style={tw`mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-500`}
              >
                <Text style={tw`text-3xl font-bold text-white`}>✓</Text>
              </View>
            </View>
            <View style={tw`gap-4`}>
              <Text style={tw`text-center font-bold`} variant='headlineMedium'>
                <Trans i18nKey='services.i589.eligible.title' />
              </Text>
              <Text style={tw`text-center`} variant='bodyLarge'>
                <Trans i18nKey='services.i589.eligible.description' />
              </Text>
              <Text style={tw`mt-4 text-center`} variant='bodyMedium'>
                <Trans i18nKey='services.i589.eligible.nextSteps' />
              </Text>
            </View>
          </Surface>
          <Button
            contentStyle={tw`flex-row-reverse`}
            icon='arrow-right'
            onPress={() => {
              resetEligibilityQuiz();
              resetSavedQuizRoute();
              setStep('info');
              router.back();
            }}
            style={tw`mt-auto`}
          >
            <Trans i18nKey='services.i589.eligible.continueButton' />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}
