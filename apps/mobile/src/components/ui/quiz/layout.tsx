import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { quizRouteFamily, useQuizRouteAtom } from '@/atoms/quiz-route-family';
import { Trans } from '@/components/trans';
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
  const route = savedQuizRoute.length > 0 ? savedQuizRoute : routes[0];

  console.log(`Redirecting to saved route: ${route}`);

  return <Redirect href={`./quiz/${route}`} />;
}

export const useQuizRoutes = () => useRequiredContext(QuizRoutesContext);

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
