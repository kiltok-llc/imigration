import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import z from 'zod/v4';

import { FormField } from '@/components/form/field';
import { FormLabel } from '@/components/form/label';
import { FormBooleanInput } from '@/components/form/radio';
import { TransButton, TransText } from '@/components/trans';
import { isOnboardingCompleteAtom } from '@/lib/onboarding';
import { required } from '@/lib/utils';

type CurrentProceedingsForm = {
  isInProceedings: boolean | null;
};

export default function CurrentProceedings() {
  const theme = useTheme();
  const router = useRouter();
  const setIsOnboarded = useSetAtom(isOnboardingCompleteAtom);

  const form = useForm<CurrentProceedingsForm>({
    defaultValues: {
      isInProceedings: null,
    },
    resolver: zodResolver(
      z.object({
        isInProceedings: required(z.boolean().nullable()),
      })
    ),
  });
  const { control, handleSubmit, watch } = form;

  const onSubmit = ({ isInProceedings }: CurrentProceedingsForm) => {
    setIsOnboarded(true);
    router.dismissAll();

    if (isInProceedings) {
      // TODO
      router.replace('/services');
    } else {
      router.replace('/services');
    }
  };

  const isButtonDisabled = watch('isInProceedings') === null;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FormProvider {...form}>
        <View style={tw`flex-1`}>
          <ScrollView
            alwaysBounceVertical={false}
            contentContainerStyle={tw`grow justify-center gap-8 px-4`}
            scrollsToTop={false}
            style={tw`flex-1`}
          >
            <View style={tw`gap-4`}>
              <View style={tw`items-center`}>
                <MaterialCommunityIcons
                  color={theme.colors.primary}
                  name='bank'
                  size={120}
                />
              </View>

              <FormLabel
                i18nKey='onboarding.current-proceedings.header'
                style={tw`text-center`}
                variant='displaySmall'
              />
            </View>

            <View style={tw`gap-4`}>
              <FormLabel
                i18nKey='onboarding.current-proceedings.question'
                style={tw`text-center font-semibold`}
                variant='titleMedium'
              />

              <FormField control={control} name='isInProceedings'>
                <FormBooleanInput />
              </FormField>
            </View>

            <TransText
              i18nKey='onboarding.current-proceedings.disclaimer'
              style={tw.style('text-center', {
                color: theme.colors.outline,
              })}
              variant='bodyMedium'
            />
          </ScrollView>

          <SafeAreaView edges={{ bottom: 'maximum' }} style={tw`p-4`}>
            <TransButton
              disabled={isButtonDisabled}
              i18nKey='onboarding.current-proceedings.continue'
              onPress={handleSubmit(onSubmit)}
            />
          </SafeAreaView>
        </View>
      </FormProvider>
    </>
  );
}
