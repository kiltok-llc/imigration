import { useSetAtom } from 'jotai';
import { PropsWithChildren } from 'react';
import { Keyboard, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { KeyboardToolbar } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { quizHeaderHeightAtom } from '@/atoms/quiz-header-height-atom';
import { TransButton, TransText } from '@/components/trans';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { useT } from '@/hooks/use-t';
import { useSetIsNextPage, useSetIsPrevPage } from '@/lib/quiz';
import { toRouteId } from '@/lib/utils';
import {
  useCurrentRoute,
  useCurrentRouteIndex,
  useNextRoute,
  useRouteUrls,
} from '@/providers/routes';
import { TranslationContextProvider } from '@/providers/translation';

export function QuizLayout({ children }: PropsWithChildren) {
  const t = useT();
  const [_, currentParams] = useCurrentRoute();
  const setIsNextPage = useSetIsNextPage();
  const setIsPrevPage = useSetIsPrevPage();

  return (
    <View style={tw`flex-1`}>
      <QuizHeader />
      <TranslationContextProvider
        value={{
          ...currentParams,
          count: Number(currentParams.index) + 1,
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
            onPress={() => {
              Keyboard.dismiss();
              setIsPrevPage(true);
            }}
          />
        </View>
        <View style={tw`flex-1`}>
          <TransButton
            contentStyle={tw`flex-row-reverse`}
            i18nKey='quiz.next'
            icon='arrow-right'
            mode='contained'
            onPress={() => {
              Keyboard.dismiss();
              setIsNextPage(true);
            }}
          />
        </View>
      </SafeAreaView>
      <KeyboardToolbar doneText={t('keyboard.done')} />
    </View>
  );
}

function QuizHeader() {
  const t = useT();
  const theme = useTheme();
  const setQuizHeaderHeight = useSetAtom(quizHeaderHeightAtom);
  const serviceId = useServiceId();
  const quizId = useStepId();

  const [currentRoute, currentParams] = useCurrentRoute();
  const [nextRoute, nextParams] = useNextRoute();
  const routes = useRouteUrls();
  const currentRouteIdx = useCurrentRouteIndex();

  const title = t(
    `services.${serviceId}.${quizId}.${toRouteId(currentRoute)}.title`,
    {
      ...currentParams,
      count: Number(currentParams.index) + 1,
      ordinal: true,
    }
  );

  const nextTitle = nextRoute
    ? t(`services.${serviceId}.${quizId}.${toRouteId(nextRoute)}.title`, {
        ...nextParams,
        count: Number(nextParams.index) + 1,
        ordinal: true,
      })
    : undefined;

  const current = currentRouteIdx + 1;
  const total = routes.length;

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
