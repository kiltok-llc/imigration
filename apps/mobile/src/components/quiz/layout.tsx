import { useSetAtom } from 'jotai';
import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Surface, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { TransButton, TransText } from '@/components/trans';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { useQuizActions } from '@/lib/quiz/actions';
import { quizFooterHeightAtom, quizHeaderHeightAtom } from '@/lib/quiz/header';
import {
  useCurrentRoute,
  useCurrentRouteIndex,
  useNextRoute,
  useRouteUrls,
} from '@/lib/routes';
import { TranslationContextProvider, useT } from '@/lib/translation';
import { toRouteId } from '@/lib/utils';

export function QuizLayout({ children }: PropsWithChildren) {
  const [_, currentParams] = useCurrentRoute();
  const { handleBack, handleContinue } = useQuizActions();

  return (
    <View style={tw`flex-1`}>
      <QuizHeader />
      <View style={tw`flex-1`}>
        <TranslationContextProvider
          value={{
            ...currentParams,
            count: Number(currentParams.index) + 1,
          }}
        >
          {children}
        </TranslationContextProvider>
      </View>
      <QuizFooter onBack={handleBack} onContinue={handleContinue} />
      {/*<KeyboardToolbar doneText={t('keyboard.done')} />*/}
    </View>
  );
}

function QuizFooter({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const theme = useTheme();
  const setQuizFooterHeight = useSetAtom(quizFooterHeightAtom);

  return (
    <Surface
      onLayout={(e) => setQuizFooterHeight(e.nativeEvent.layout.height)}
      style={tw.style({
        backgroundColor: theme.colors.surface,
      })}
    >
      <SafeAreaView
        edges={{ bottom: 'maximum' }}
        style={tw`mt-auto flex-row gap-4 p-4`}
      >
        <View style={tw`flex-1`}>
          <TransButton
            i18nKey='quiz.back'
            icon='arrow-left'
            mode='contained-tonal'
            onPress={onBack}
          />
        </View>
        <View style={tw`flex-1`}>
          <TransButton
            contentStyle={tw`flex-row-reverse`}
            i18nKey='quiz.continue'
            icon='arrow-right'
            mode='contained'
            onPress={onContinue}
          />
        </View>
      </SafeAreaView>
    </Surface>
  );
}

function QuizHeader() {
  const t = useT();
  const theme = useTheme();
  const setQuizHeaderHeight = useSetAtom(quizHeaderHeightAtom);
  const service = useService();
  const step = useStep();

  const [currentRoute, currentParams] = useCurrentRoute();
  const [nextRoute, nextParams] = useNextRoute();
  const routes = useRouteUrls();
  const currentRouteIdx = useCurrentRouteIndex();

  const title = t(
    `services.${service}.${step}.${toRouteId(currentRoute)}.title`,
    {
      ...currentParams,
      count: Number(currentParams.count),
      ordinal: true,
    }
  );

  const nextTitle = nextRoute
    ? t(`services.${service}.${step}.${toRouteId(nextRoute)}.title`, {
        ...nextParams,
        count: Number(nextParams.count),
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
        size={70}
        tintColor={theme.colors.primary}
        width={5}
      >
        {() => (
          <TransText
            i18nKey='quiz.header.progress'
            style={tw`font-mono`}
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
