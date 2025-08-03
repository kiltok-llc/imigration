import { useRouter } from 'expo-router';
import {
  Children,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { ReactivePagerView } from '@/components/reactive-pager-view';
import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { QuizActions, QuizContents, QuizLayout } from '@/components/ui/quiz';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useFocusedRouteListener } from '@/hooks/use-route';
import { useRouteNavigation } from '@/hooks/use-route-navigation';

type EligibilityQuizPageProps = {
  onSubmit: () => PageResult;
};

type PageResult = 'INELIGIBLE' | 'MISSING' | 'NEXT' | 'PREVIOUS';

const EligibilityQuizRoutesContext = createRequiredContext<string[]>();

export const useEligibilityQuizRoutes = () =>
  useRequiredContext(EligibilityQuizRoutesContext);

export function EligibilityQuiz({
  children,
}: {
  children:
    | ReactElement<EligibilityQuizPageProps>
    | ReactElement<EligibilityQuizPageProps>[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const routes = useEligibilityQuizRoutes();
  const { isFirstRoute, isLastRoute, nextRoute, prevRoute } =
    useRouteNavigation(routes);

  const pageProps = useMemo(() => {
    return Children.map(children, (child) => child.props);
  }, [children]);

  const handleNext = () => {
    const result = pageProps[page]?.onSubmit();

    if (result === 'INELIGIBLE') {
      router.replace('../ineligible');
      return;
    }

    if (result === 'MISSING') {
      toast.error(t('quiz.missing'));
      return;
    }

    if (result === 'NEXT') {
      if (page < pageProps.length - 1) {
        void setPage(page + 1);
      } else if (isLastRoute) {
        router.replace('../eligible');
      } else {
        nextRoute();
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      void setPage(page - 1);
    } else if (isFirstRoute) {
      router.back();
    } else {
      prevRoute();
    }
  };

  return (
    <QuizLayout>
      <ReactivePagerView orientation='vertical' page={page} style={tw`flex-1`}>
        {Children.map(children, (child, index) => (
          <View key={index}>{child}</View>
        ))}
      </ReactivePagerView>
      <QuizActions>
        <Button icon='arrow-left' mode='contained-tonal' onPress={handlePrev}>
          <Trans i18nKey='quiz.back' />
        </Button>
        <Button
          contentStyle={tw`flex-row-reverse`}
          icon='arrow-right'
          mode='contained'
          onPress={handleNext}
        >
          <Trans i18nKey='quiz.continue' />
        </Button>
      </QuizActions>
    </QuizLayout>
  );
}

export function EligibilityQuizPage({
  children,
}: PropsWithChildren<EligibilityQuizPageProps>) {
  return <QuizContents>{children}</QuizContents>;
}

export function EligibilityQuizRoutesProvider({
  children,
  onSaveFocusedRoute,
  routes,
}: PropsWithChildren<{
  onSaveFocusedRoute?: (route: string) => void;
  routes: string[];
}>) {
  useFocusedRouteListener((route) => {
    if (!routes.includes(route)) {
      return;
    }

    onSaveFocusedRoute?.(route);
  });

  return (
    <EligibilityQuizRoutesContext.Provider value={routes}>
      {children}
    </EligibilityQuizRoutesContext.Provider>
  );
}
