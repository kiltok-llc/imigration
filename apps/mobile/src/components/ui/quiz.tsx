import { PropsWithChildren, ReactNode } from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Trans } from '@/components/trans';

export function QuizHeader({current, nextTitle, title, total}: {
  current: number,
  nextTitle?: ReactNode,
  title: ReactNode,
  total: number,
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
          <Text variant="bodyMedium">
            <Trans
              i18nKey="quiz.header.progress"
              values={{current, total}}
            />
          </Text>
        )}
      </AnimatedCircularProgress>

      <View style={tw`flex-1 items-end justify-start gap-2`}>
        <Text style={tw`font-bold`} variant='headlineSmall'>
          <Trans i18nKey='quiz.header.title' values={{title}}/>
        </Text>
        {nextTitle && (
          <Text variant='titleSmall'>
            <Trans i18nKey='quiz.header.nextTitle' values={{nextTitle}}/>
          </Text>
        )}
      </View>
    </View>
  );
}

export function QuizLayout({ children }: PropsWithChildren) {
  return (
    <View style={tw`flex-1 items-center justify-center p-4`}>
      {children}
    </View>
  );
}