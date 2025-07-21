import { Stack } from 'expo-router';
import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';

interface StepProps {
  title?: string;
}

export function MultiStepScreen({
  children,
}: {
  children: ReactElement<StepProps>[];
}) {
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    setStepCount(Children.count(children));
  }, [children, setStepCount]);

  const _handleSetActiveStep = (step: number): void => {
    const boundedStep = Math.min(Math.max(step, 0), stepCount - 1);
    setActiveStep(boundedStep);
  };

  const active = children[activeStep]!;
  const _previous = children[activeStep - 1];
  const next = children[activeStep + 1];

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`m-4 flex-row items-center justify-between gap-2`}>
          <AnimatedCircularProgress
            backgroundColor={theme.colors.surfaceDisabled}
            fill={80}
            rotation={0}
            size={80}
            tintColor={theme.colors.primary}
            width={6}
          >
            {() => (
              <Text variant='bodyMedium'>
                <Trans
                  i18nKey='multistep.step'
                  values={{ activeStep: activeStep + 1, stepCount }}
                />
              </Text>
            )}
          </AnimatedCircularProgress>
          <View style={tw`items-end gap-2`}>
            <Text style={tw`font-bold`} variant='headlineMedium'>
              <Trans
                i18nKey='multistep.title'
                values={{ title: active.props.title }}
              />
            </Text>
            {next && (
              <Text variant='titleSmall'>
                <Trans
                  i18nKey='multistep.subtitle'
                  values={{ title: next.props.title }}
                />
              </Text>
            )}
          </View>
        </View>
        {active}
      </SafeAreaView>
    </>
  );
}

export function Step({ children }: PropsWithChildren<StepProps>) {
  return <>{children}</>;
}
