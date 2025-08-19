import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  ErrorBoundaryProps,
  Redirect,
  useGlobalSearchParams,
  useRouter,
} from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ErrorBoundaryProps as ReactErrorBoundaryProps } from 'react-error-boundary';
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
import { useFocusedRouteName } from '@/hooks/use-route';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { useT } from '@/hooks/use-t';
import { toRouteId } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

const QuizContext = createRequiredContext<{
  finalRoute: string;
  isFirstRoute: boolean;
  isLastRoute: boolean;
  isNextPage: boolean;
  isPrevPage: boolean;
  nextRoute: () => void;
  prevRoute: () => void;
  routes: string[];
  setIsNextPage: (value: boolean) => void;
  setIsPrevPage: (value: boolean) => void;
}>();

export function QuizRouteNotFoundRedirect() {
  const { routes } = useQuiz();

  console.warn(
    `Redirecting to first route (requested route not found!): ${routes[0]}`
  );

  return <Redirect href={`./${routes[0]}`} />;
}

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
  const t = useT();
  const router = useRouter();
  const serviceId = useServiceId();
  const quizId = useStepId();
  const routeName = useFocusedRouteName();
  const routeParams = useGlobalSearchParams<Record<string, string>>();
  const routeNameWithParams =
    Object.keys(routeParams).length > 0
      ? `${routeName}?${new URLSearchParams(routeParams).toString()}`
      : routeName;
  const routeIdx = routes.indexOf(routeNameWithParams);
  const nextRouteNameWithParams = routes[routeIdx + 1];
  const [nextRouteName, nextRouteParamsString] =
    nextRouteNameWithParams?.split('?') ?? [];
  const nextRouteParams = Object.fromEntries(
    new URLSearchParams(nextRouteParamsString ?? '')
  );

  const setQuizRoute = useSetAtom(quizRouteFamily({ quizId, serviceId }));
  const [isNextPage, setIsNextPage] = useState(false);
  const [isPrevPage, setIsPrevPage] = useState(false);

  useEffect(() => {
    if (routes.includes(routeNameWithParams)) {
      setQuizRoute(routeNameWithParams);
    }
  }, [routeNameWithParams, routes, setQuizRoute]);

  const handlePrev = () => {
    Keyboard.dismiss();
    setIsPrevPage(true);
  };

  const handleNext = async () => {
    Keyboard.dismiss();
    setIsNextPage(true);
  };

  const incrementRoute = useCallback(
    (update: number) => {
      if (routeIdx === -1) {
        console.warn(`Current route is not in the defined routes list.`);
        return;
      }

      const index = routeIdx + update;
      const route = routes[index];
      if (!route) {
        console.warn(`Next route index out of bounds: ${index}.`);
        return;
      }

      console.log(`Navigating to ${route} from ${routeNameWithParams}`);

      const level = routeNameWithParams.split('/').length - 1;
      const nesting = '../'.repeat(level);
      router.replace(`./${nesting}${route}`);
    },
    [routeIdx, routeNameWithParams, router, routes]
  );

  const nextRoute = useCallback(() => incrementRoute(1), [incrementRoute]);
  const prevRoute = useCallback(() => incrementRoute(-1), [incrementRoute]);

  return (
    <QuizContext.Provider
      value={{
        finalRoute,
        isFirstRoute: routeIdx === 0,
        isLastRoute: routeIdx === routes.length - 1,
        isNextPage,
        isPrevPage,
        nextRoute,
        prevRoute,
        routes,
        setIsNextPage,
        setIsPrevPage,
      }}
    >
      <View style={tw`flex-1`}>
        <QuizHeader
          current={routeIdx + 1}
          nextTitle={
            nextRouteName
              ? t(
                  `services.${serviceId}.${quizId}.${toRouteId(nextRouteName)}.title`,
                  {
                    ...nextRouteParams,
                    count: Number(nextRouteParams.index) + 1,
                    ordinal: true,
                  }
                )
              : undefined
          }
          title={t(
            `services.${serviceId}.${quizId}.${toRouteId(routeName)}.title`,
            {
              ...routeParams,
              count: Number(routeParams.index) + 1,
              ordinal: true,
            }
          )}
          total={routes.length}
        />
        <TranslationContextProvider
          value={{
            ...routeParams,
            count: Number(routeParams.index) + 1,
          }}
        >
          {children}
        </TranslationContextProvider>
        <SafeAreaView edges={['bottom']} style={tw`mt-auto flex-row gap-4 p-4`}>
          <View style={tw`flex-1`}>
            <TransButton
              i18nKey='quiz.previous'
              icon='arrow-left'
              mode='contained-tonal'
              onPress={handlePrev}
            />
          </View>
          <View style={tw`flex-1`}>
            <TransButton
              contentStyle={tw`flex-row-reverse`}
              i18nKey='quiz.next'
              icon='arrow-right'
              mode='contained'
              onPress={handleNext}
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
          style={tw`text-right font-bold`}
          values={{ title }}
          variant='headlineSmall'
        />
        {nextTitle && (
          <TransText
            i18nKey='quiz.header.nextTitle'
            style={tw`text-right`}
            values={{ nextTitle }}
            variant='titleSmall'
          />
        )}
      </View>
    </View>
  );
}
