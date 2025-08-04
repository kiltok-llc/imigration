import { useRouter } from 'expo-router';
import {
  Children,
  ComponentProps,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { ReactivePagerView } from '@/components/reactive-pager-view';
import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { useQuizRoutes } from '@/components/ui/quiz/layout';
import { createRequiredContext } from '@/hooks/use-required-context';
import { useRouteNavigation } from '@/hooks/use-route-navigation';

type QuizPageProps = {
  onSubmit: () => boolean;
};

export function QuizPage({
  contentContainerStyle,
  style,
  ...props
}: ComponentProps<typeof ScrollView> & QuizPageProps) {
  return (
    <ScrollView
      contentContainerStyle={[
        tw`grow-1 justify-center gap-4 py-4`,
        contentContainerStyle,
      ]}
      style={[tw`mx-4 flex-1`, style]}
      {...props}
    />
  );
}

const QuizContext = createRequiredContext<{
  handleNext: () => void;
  handlePrev: () => void;
}>();

export function Quiz({
  children,
}: {
  children: ReactElement<QuizPageProps> | ReactElement<QuizPageProps>[];
}) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { finalRoute, routes } = useQuizRoutes();
  const { isFirstRoute, isLastRoute, nextRoute, prevRoute } =
    useRouteNavigation(routes);

  const pageProps = useMemo(() => {
    return Children.map(children, (child) => child.props);
  }, [children]);

  const handleNext = useCallback(() => {
    if (page < pageProps.length - 1) {
      void setPage(page + 1);
    } else if (isLastRoute) {
      router.replace(finalRoute);
    } else {
      nextRoute();
    }
  }, [page, pageProps.length, isLastRoute, router, finalRoute, nextRoute]);

  const handleSubmit = useCallback(() => {
    const result = pageProps[page]?.onSubmit();
    if (result) {
      handleNext();
    }
  }, [page, pageProps, handleNext]);

  const handlePrev = useCallback(() => {
    if (page > 0) {
      void setPage(page - 1);
    } else if (isFirstRoute) {
      router.back();
    } else {
      prevRoute();
    }
  }, [page, isFirstRoute, prevRoute, router]);

  return (
    <QuizContext.Provider value={{ handleNext, handlePrev }}>
      <SafeAreaView
        edges={['left', 'bottom', 'right']}
        style={tw`flex-1 gap-4`}
      >
        <ReactivePagerView
          orientation='vertical'
          page={page}
          style={tw`flex-1`}
        >
          {Children.map(children, (child, index) => (
            <View key={index}>{child}</View>
          ))}
        </ReactivePagerView>
        <View style={tw`mx-4 mt-auto flex-row gap-4`}>
          <View style={tw`flex-1`}>
            <Button
              icon='arrow-left'
              mode='contained-tonal'
              onPress={handlePrev}
            >
              <Trans i18nKey='quiz.back' />
            </Button>
          </View>
          <View style={tw`flex-1`}>
            <Button
              contentStyle={tw`flex-row-reverse`}
              icon='arrow-right'
              mode='contained'
              onPress={handleSubmit}
            >
              <Trans i18nKey='quiz.continue' />
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </QuizContext.Provider>
  );
}
