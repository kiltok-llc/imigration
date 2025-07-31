import { t } from 'i18next';
import { ComponentProps, createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Button, Checkbox, CheckboxProps RadioButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { toBoolean } from '@/lib/utils';

export function QuizActions({ children }: PropsWithChildren) {
  return (
    <View style={tw`mt-auto gap-4`}>
      {children}
    </View>
  );
}

const CheckboxGroupContext = createContext<{
  onChange: (value: T[]) => void
  value: T[],
}>({
  onChange: () => {},
  value: [],
});

export function QuizCheckbox({
                               value,
                               ...props
                             }: Omit<ComponentProps<typeof Checkbox.Item>, 'status'> & {
  value?: string;
  status?: CheckboxProps['status'];
}) {
  const { onChange, value: values } = useContext(CheckboxGroupContext);
  const checked = !!value && values.includes(value);

  return (
    <Checkbox.Item
      onPress={() => !!value && onChange(checked ? values.filter((v) => v !== value) : [...values, value])}
      status={checked ? 'checked' : 'unchecked'}
      {...props}
    />
  );
}

export function QuizCheckboxGroup<T>(
  {
    onChange,
    value,
    ...props
  }: ComponentProps<typeof View> & {
    onChange: (value: T[]) => void;
    value: T[];
  },
) {
  return (
    <CheckboxGroupContext.Provider value={{ onChange, value }}>
      <View {...props} />
    </CheckboxGroupContext.Provider>
  );
}

export function QuizContents({ style, ...props }: ComponentProps<typeof View>) {
  return (
    <View style={[tw`flex-1 gap-4 justify-center`, style]} {...props} />
  );
}

export function QuizHeader({ current, nextTitle, title, total }: {
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
              values={{ current, total }}
            />
          </Text>
        )}
      </AnimatedCircularProgress>

      <View style={tw`flex-1 items-end justify-start gap-2`}>
        <Text style={tw`font-bold`} variant="headlineSmall">
          <Trans i18nKey="quiz.header.title" values={{ title }} />
        </Text>
        {nextTitle && (
          <Text variant="titleSmall">
            <Trans i18nKey="quiz.header.nextTitle" values={{ nextTitle }} />
          </Text>
        )}
      </View>
    </View>
  );
}

export function QuizLayout({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['left', 'bottom', 'right']} style={tw`flex-1 pt-4 gap-4 px-4`}>
      {children}
    </SafeAreaView>
  );
}

export function QuizPrimaryActionButton({
                                          children,
                                          contentStyle,
                                          labelStyle,
                                          ...props
                                        }: ComponentProps<typeof Button>) {
  return (
    // TODO make icon larger
    <Button contentStyle={[tw`flex-row-reverse py-1`, contentStyle]} icon="arrow-right"
            labelStyle={[tw`text-lg`, labelStyle]} mode="contained" {...props}>
      {children}
    </Button>
  );
}

export function QuizPrimaryQuestionText({ children, style, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      style={[tw`font-bold text-center mb-8`, style]}
      variant="headlineMedium"
      {...props}
    >
      {children}
    </Text>
  );
}

export function QuizYesNoInput({
                                 onChange,
                                 value,
                                 ...props
                               }: Omit<ComponentProps<typeof RadioButton.Group>, 'children' | 'onValueChange' | 'value'> & {
  onChange: (value: boolean) => void;
  value?: boolean;
}) {
  // TODO add circular radio buttons to radio buttons
  return (
    <RadioButton.Group
      onValueChange={value => onChange(toBoolean(value))}
      value={String(value)}
      {...props}
    >
      <RadioButton.Item label={t('yes')} labelStyle={tw`text-lg`} value="true" />
      <RadioButton.Item label={t('no')} labelStyle={tw`text-lg`} value="false" />
    </RadioButton.Group>
  );
}