import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ErrorBoundaryProps, Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ErrorBoundaryProps as ReactErrorBoundaryProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { KeyboardToolbar } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { quizHeaderHeightAtom } from '@/atoms/quiz-header-height-atom';
import { quizRouteFamily, useQuizRouteAtom } from '@/atoms/quiz-route-family';
import { useResetQuizValues } from '@/atoms/quiz-values-family';
import { TransButton, TransText } from '@/components/trans';
import { Container } from '@/components/ui/container';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import {
  useFocusedRouteListener,
  useFocusedRouteName,
} from '@/hooks/use-route';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toRouteId } from '@/lib/utils';

const QuizContext = createRequiredContext<{
  finalRoute: string;
  isNextPage: boolean;
  isPrevPage: boolean;
  routes: string[];
  setisNextPage: (value: boolean) => void;
  setisPrevPage: (value: boolean) => void;
}>();

export function SavedQuizRouteRedirect() {
  const { routes } = useQuiz();
  const savedQuizRoute = useAtomValue(useQuizRouteAtom());
  const route =
    savedQuizRoute && routes.includes(savedQuizRoute)
      ? savedQuizRoute
      : routes[0];

  console.log(`Redirecting to saved route: ${route}`);

  return <Redirect href={`./quiz/${route}`} />;
}

export const useQuiz = () => useRequiredContext(QuizContext);

export function QuizErrorFallback({
  children,
  error,
  retry,
}: PropsWithChildren<ErrorBoundaryProps> & ReactErrorBoundaryProps) {
  const theme = useTheme();
  const resetQuizRoute = useResetAtom(useQuizRouteAtom());
  const resetQuizValues = useResetQuizValues();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Container style={tw`flex-1 items-center justify-center gap-8`}>
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
          onPress={resetQuizRoute}
        />

        <TransButton
          i18nKey='quiz.error.reset-values'
          mode='text'
          onPress={resetQuizValues}
        />

        {children}
      </Container>
    </SafeAreaView>
  );
}

export function QuizLayout({
  children,
  finalRoute = '../',
  routes,
}: PropsWithChildren<{
  finalRoute?: string;
  onComplete?: () => void;
  routes: string[];
}>) {
  const { t } = useTranslation();
  const serviceId = useServiceId();
  const quizId = useStepId();
  const routeName = useFocusedRouteName();
  const routeIdx = routes.indexOf(routeName);
  const nextRouteName = routes[routeIdx + 1];
  const setSavedQuizRoute = useSetAtom(quizRouteFamily({ quizId, serviceId }));
  const [isNextPage, setisNextPage] = useState(false);
  const [isPrevPage, setisPrevPage] = useState(false);

  useFocusedRouteListener((route) => {
    if (!routes.includes(route)) {
      return;
    }

    setSavedQuizRoute(route);
  });

  const handleBack = () => {
    Keyboard.dismiss();
    setisPrevPage(true);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setisNextPage(true);
  };

  return (
    <QuizContext.Provider
      value={{
        finalRoute,
        isNextPage,
        isPrevPage,
        routes,
        setisNextPage,
        setisPrevPage,
      }}
    >
      <View style={tw`flex-1`}>
        <QuizHeader
          current={routeIdx + 1}
          nextTitle={
            nextRouteName
              ? t(
                  `services.${serviceId}.${quizId}.${toRouteId(nextRouteName)}.title`
                )
              : undefined
          }
          title={t(
            `services.${serviceId}.${quizId}.${toRouteId(routeName)}.title`
          )}
          total={routes.length}
        />
        {children}
        <SafeAreaView edges={['bottom']} style={tw`mt-auto flex-row gap-4 p-4`}>
          <View style={tw`flex-1`}>
            <TransButton
              i18nKey='quiz.previous'
              icon='arrow-left'
              mode='contained-tonal'
              onPress={handleBack}
            />
          </View>
          <View style={tw`flex-1`}>
            <TransButton
              contentStyle={tw`flex-row-reverse`}
              i18nKey='quiz.next'
              icon='arrow-right'
              mode='contained'
              onPress={handleSubmit}
            />
          </View>
        </SafeAreaView>
        <KeyboardToolbar doneText={t('keyboard.done')} />
      </View>
    </QuizContext.Provider>
  );
}

function QuizHeader({
  current,
  nextTitle,
  title,
  total,
}: {
  current: number;
  nextTitle?: ReactNode;
  title: ReactNode;
  total: number;
}) {
  const theme = useTheme();
  const setQuizHeaderHeight = useSetAtom(quizHeaderHeightAtom);

  return (
    <View
      onLayout={(e) => setQuizHeaderHeight(e.nativeEvent.layout.height)}
      style={tw`flex-row items-stretch justify-between gap-2 p-4`}
    >
      <AnimatedCircularProgress
        backgroundColor={theme.colors.surfaceDisabled}
        fill={(current / total) * 100}
        rotation={0}
        size={80}
        tintColor={theme.colors.primary}
        width={6}
      >
        {() => (
          <TransText
            i18nKey='quiz.header.progress'
            values={{ current, total }}
            variant='bodyMedium'
          />
        )}
      </AnimatedCircularProgress>

      <View style={tw`flex-1 items-end justify-start gap-2`}>
        <TransText
          i18nKey='quiz.header.title'
          style={tw`font-bold`}
          values={{ title }}
          variant='headlineSmall'
        />
        {nextTitle && (
          <TransText
            i18nKey='quiz.header.nextTitle'
            values={{ nextTitle }}
            variant='titleSmall'
          />
        )}
      </View>
    </View>
  );
}
