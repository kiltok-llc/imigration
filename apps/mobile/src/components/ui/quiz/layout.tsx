import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ErrorBoundaryProps, Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, ReactNode } from 'react';
import { ErrorBoundaryProps as ReactErrorBoundaryProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { quizRouteFamily, useQuizRouteAtom } from '@/atoms/quiz-route-family';
import { useResetQuizValues } from '@/atoms/quiz-values-family';
import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
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

const QuizRoutesContext = createRequiredContext<{
  finalRoute: string;
  routes: string[];
}>();

export function SavedQuizRouteRedirect() {
  const { routes } = useQuizRoutes();
  const savedQuizRoute = useAtomValue(useQuizRouteAtom());
  const route =
    savedQuizRoute && routes.includes(savedQuizRoute)
      ? savedQuizRoute
      : routes[0];

  console.log(`Redirecting to saved route: ${route}`);

  return <Redirect href={`./quiz/${route}`} />;
}

export const useQuizRoutes = () => useRequiredContext(QuizRoutesContext);

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

        <Text style={tw`text-center`} variant='headlineSmall'>
          <Trans i18nKey='error.title' />
        </Text>

        <Text style={tw`text-center`} variant='bodyLarge'>
          <Trans i18nKey='error.message' values={{ message: error.message }} />
        </Text>

        <Button mode='text' onPress={retry}>
          <Trans i18nKey='error.retry' />
        </Button>

        <Button mode='text' onPress={resetQuizRoute}>
          <Trans i18nKey='quiz.error.reset-route' />
        </Button>

        <Button mode='text' onPress={resetQuizValues}>
          <Trans i18nKey='quiz.error.reset-values' />
        </Button>

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

  useFocusedRouteListener((route) => {
    if (!routes.includes(route)) {
      return;
    }

    setSavedQuizRoute(route);
  });

  return (
    <QuizRoutesContext.Provider value={{ finalRoute, routes }}>
      <View style={tw`flex-1`}>
        <QuizHeader
          current={routeIdx + 1}
          nextTitle={
            nextRouteName
              ? t(`services.${serviceId}.${quizId}.${nextRouteName}.title`)
              : undefined
          }
          title={t(`services.${serviceId}.${quizId}.${routeName}.title`)}
          total={routes.length}
        />
        {children}
      </View>
    </QuizRoutesContext.Provider>
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

  return (
    <View style={tw`flex-row items-stretch justify-between gap-2 p-4`}>
      <AnimatedCircularProgress
        backgroundColor={theme.colors.surfaceDisabled}
        fill={(current / total) * 100}
        rotation={0}
        size={80}
        tintColor={theme.colors.primary}
        width={6}
      >
        {() => (
          <Text variant='bodyMedium'>
            <Trans i18nKey='quiz.header.progress' values={{ current, total }} />
          </Text>
        )}
      </AnimatedCircularProgress>

      <View style={tw`flex-1 items-end justify-start gap-2`}>
        <Text style={tw`font-bold`} variant='headlineSmall'>
          <Trans i18nKey='quiz.header.title' values={{ title }} />
        </Text>
        {nextTitle && (
          <Text variant='titleSmall'>
            <Trans i18nKey='quiz.header.nextTitle' values={{ nextTitle }} />
          </Text>
        )}
      </View>
    </View>
  );
}
