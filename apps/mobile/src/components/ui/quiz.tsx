import { t } from 'i18next';
import {
  Children,
  ComponentProps,
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { ScrollView, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  Button,
  Checkbox,
  CheckboxProps,
  RadioButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { arraysEqual, toBoolean } from '@/lib/utils';

type CheckboxGroupContextValue<T = string> = {
  onChange: (value: T[]) => void;
  value: T[];
};

export function QuizActions({
  children,
  style,
  ...props
}: ComponentProps<typeof View>) {
  return (
    <View style={[tw`mx-4 mt-auto flex-row gap-4`, style]} {...props}>
      {Children.map(children, (child) => (
        <View style={tw`flex-1`}>{child}</View>
      ))}
    </View>
  );
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({
  onChange: () => {},
  value: [],
});

// TODO is there a better way to do this typing?
const useCheckboxGroupContext = <T,>() =>
  useContext(CheckboxGroupContext) as unknown as CheckboxGroupContextValue<T>;

export function QuizCheckbox<T>({
  exclusive = false,
  value,
  ...props
}: Omit<ComponentProps<typeof Checkbox.Item>, 'status'> & {
  exclusive?: boolean;
  status?: CheckboxProps['status'];
  value: T;
}) {
  const { onChange, value: values } = useCheckboxGroupContext<T>();
  const checked = values.includes(value);

  const toggle = useCallback(() => {
    if (checked) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange(exclusive ? [value] : [...values, value]);
    }
  }, [checked, exclusive, onChange, value, values]);

  // Need to uncheck ourselves if we are exclusive but another box is checked
  useEffect(() => {
    if (exclusive && checked && !arraysEqual(values, [value])) {
      toggle();
    }
  }, [checked, exclusive, toggle, value, values]);

  return (
    <Checkbox.Item
      onPress={toggle}
      status={checked ? 'checked' : 'unchecked'}
      {...props}
    />
  );
}

export function QuizCheckboxGroup<T>({
  onChange,
  value,
  ...props
}: ComponentProps<typeof View> & {
  onChange: (value: T[]) => void;
  value: T[];
}) {
  return (
    // TODO more typing shenanigans to improve
    <CheckboxGroupContext.Provider
      value={{ onChange, value } as unknown as CheckboxGroupContextValue}
    >
      <View {...props} />
    </CheckboxGroupContext.Provider>
  );
}

export function QuizContents({
  contentContainerStyle,
  style,
  ...props
}: ComponentProps<typeof ScrollView>) {
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

export function QuizHeader({
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

export function QuizLayout({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['left', 'bottom', 'right']} style={tw`flex-1 gap-4`}>
      {children}
    </SafeAreaView>
  );
}

export function QuizPrimaryActionButton({
  children,
  contentStyle,
  labelStyle,
  style,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    // TODO make icon larger
    <Button
      contentStyle={[tw`flex-row-reverse py-1`, contentStyle]}
      icon='arrow-right'
      labelStyle={[tw`text-lg`, labelStyle]}
      mode='contained'
      style={[tw`w-full`, style]}
      {...props}
    >
      {children}
    </Button>
  );
}

export function QuizPrimaryQuestionText({
  children,
  style,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      style={[tw`mb-8 text-center font-bold`, style]}
      variant='headlineMedium'
      {...props}
    >
      {children}
    </Text>
  );
}

export function QuizSecondaryActionButton({
  children,
  contentStyle,
  labelStyle,
  style,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    // TODO make icon larger
    <Button
      contentStyle={[tw`py-1`, contentStyle]}
      icon='arrow-left'
      labelStyle={[tw`text-lg`, labelStyle]}
      mode='contained-tonal'
      style={[tw`w-full`, style]}
      {...props}
    >
      {children}
    </Button>
  );
}

export function QuizYesNoInput({
  onChange,
  value,
  ...props
}: Omit<
  ComponentProps<typeof RadioButton.Group>,
  'children' | 'onValueChange' | 'value'
> & {
  onChange: (value: boolean) => void;
  value?: boolean;
}) {
  // TODO add circular radio buttons to radio buttons
  return (
    <RadioButton.Group
      onValueChange={(value) => onChange(toBoolean(value))}
      value={String(value)}
      {...props}
    >
      <RadioButton.Item
        label={t('yes')}
        labelStyle={tw`text-lg`}
        value='true'
      />
      <RadioButton.Item
        label={t('no')}
        labelStyle={tw`text-lg`}
        value='false'
      />
    </RadioButton.Group>
  );
}
