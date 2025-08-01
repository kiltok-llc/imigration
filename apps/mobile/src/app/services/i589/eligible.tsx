import { router, Stack } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { quizAnswersAtom, savedQuizRouteAtom } from '@/lib/services/i589/eligibility';
import { stepIdAtom } from '@/lib/services/i589/steps';

export default function I589Eligible() {
  const { t } = useTranslation();
  const resetEligibilityQuiz = useResetAtom(quizAnswersAtom);
  const resetSavedQuizRoute = useResetAtom(savedQuizRouteAtom);
  const setStep = useSetAtom(stepIdAtom);

  return (
    <>
      <Stack.Screen options={{
        title: t('services.i589.eligible.screenTitle'),
      }} />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`flex-1 p-8 pt-10 my-20 gap-10 w-full h-full`}>
            <View style={tw`items-center mb-8`}>
              <View style={tw`w-20 h-20 rounded-full bg-green-500 items-center justify-center mb-6`}>
                <Text style={tw`text-white text-3xl font-bold`}>✓</Text>
              </View>
            </View>
            <View style={tw`gap-4`}>
              <Text style={tw`font-bold text-center`} variant="headlineMedium">
                <Trans i18nKey="services.i589.eligible.title" />
              </Text>
              <Text style={tw`text-center`} variant="bodyLarge">
                <Trans i18nKey="services.i589.eligible.description" />
              </Text>
              <Text style={tw`text-center mt-4`} variant="bodyMedium">
                <Trans i18nKey="services.i589.eligible.nextSteps" />
              </Text>
            </View>
          </Surface>
          <Button
            contentStyle={tw`flex-row-reverse py-1`}
            icon="arrow-right"
            labelStyle={tw`text-lg`}
            mode="contained"
            onPress={() => {
              resetEligibilityQuiz();
              resetSavedQuizRoute();
              setStep('personal-info');
              router.back();
            }}
            style={tw`mt-auto`}
          >
            <Trans i18nKey="services.i589.eligible.continueButton" />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}