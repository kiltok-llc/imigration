import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ErrorBoundaryProps, useRouter } from 'expo-router';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren } from 'react';
import { ErrorBoundaryProps as ReactErrorBoundaryProps } from 'react-error-boundary';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { useResetQuizValues } from '@/atoms/quiz-page-values';
import { useQuizRouteAtom } from '@/atoms/quiz-route-family';
import { TransButton, TransText } from '@/components/trans';

export function QuizErrorFallback({
  children,
  error,
  retry,
}: PropsWithChildren<ErrorBoundaryProps> & ReactErrorBoundaryProps) {
  const theme = useTheme();
  const resetQuizRoute = useResetAtom(useQuizRouteAtom());
  const resetQuizValues = useResetQuizValues();
  const router = useRouter();

  return (
    <View style={tw`flex-1 items-center justify-center gap-8 p-4`}>
      <MaterialCommunityIcons
        color={theme.colors.error}
        name='alert-circle'
        size={72}
      />

      <TransText
        i18nKey='error.title'
        style={tw`text-center`}
        variant='headlineSmall'
      />

      <TransText
        i18nKey='error.message'
        style={tw`text-center`}
        values={{ message: error.message }}
        variant='bodyLarge'
      />

      <TransButton i18nKey='error.retry' mode='text' onPress={retry} />

      <TransButton
        i18nKey='quiz.error.reset-route'
        mode='text'
        onPress={() => {
          resetQuizRoute();
          router.back();
        }}
      />

      <TransButton
        i18nKey='quiz.error.reset-values'
        mode='text'
        onPress={() => {
          resetQuizValues();
          void retry();
        }}
      />

      {children}
    </View>
  );
}
