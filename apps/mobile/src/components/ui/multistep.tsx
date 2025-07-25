import { Stack } from 'expo-router';
import {
  BaseSyntheticEvent,
  Children,
  createRef,
  PropsWithChildren,
  ReactElement,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  type UseFormProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useMMKVObject } from 'react-native-mmkv';
import PagerView from 'react-native-pager-view';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { createStore, type StoreApi, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Trans } from '@/components/trans';
import { ErrorFallback } from '@/components/ui/error';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { storage } from '@/lib/mmkv';
import { zustandStorage } from '@/lib/zustand';

interface MultiStepState {
  activeStep: number;
  clearHandleSubmitStep: () => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitStep?: (e?: BaseSyntheticEvent) => Promise<void>;
  name: string;
  pagerViewRef: RefObject<null | PagerView>;
  savedStepData: Record<string, unknown>;
  saveStepData: (name: string, data: unknown) => void;
  setHandleSubmitStep: (
    onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  ) => void;
  setStepCount: (count: number) => void;
  stepCount: number;
}

const ActiveStepContext = createRequiredContext<boolean>();
const useIsActiveStep = () => useRequiredContext(ActiveStepContext);

const MultiStepContext = createRequiredContext<StoreApi<MultiStepState>>();

const useMultiStepState = <T,>(selector: (state: MultiStepState) => T) =>
  useStore(useRequiredContext(MultiStepContext), selector);

interface StepProps {
  name: string;
  title: string;
}

export function FormStep<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  children,
  formOptions,
  name,
  onSubmit,
}: PropsWithChildren<StepProps> & {
  formOptions: UseFormProps<TFieldValues, TContext, TTransformedValues>;
  // Must be stable!
  onSubmit?: (data: TTransformedValues, name?: string) => Promise<boolean>;
}) {
  const multiName = useMultiStepState((state) => state.name);
  const setHandleSubmitStep = useMultiStepState(
    (state) => state.setHandleSubmitStep
  );
  const clearHandleSubmitStep = useMultiStepState(
    (state) => state.clearHandleSubmitStep
  );
  const handleNextStep = useMultiStepState((state) => state.handleNextStep);

  const [savedValues, setSavedValues] = useMMKVObject(
    `multistep.${multiName}.form.${name}.saved`,
    storage
  );

  const context = useForm<TFieldValues, TContext, TTransformedValues>({
    ...formOptions,
    defaultValues: (savedValues ??
      formOptions.defaultValues) as DefaultValues<TFieldValues>,
  });
  const { handleSubmit, subscribe } = context;

  useEffect(
    () =>
      subscribe({
        callback: ({ values }) => {
          setSavedValues(values);
        },
        formState: {
          values: true,
        },
      }),
    [setSavedValues, subscribe]
  );

  const active = useIsActiveStep();

  useEffect(() => {
    if (!active) {
      return;
    }

    setHandleSubmitStep(
      handleSubmit(async (data) => {
        const result =
          onSubmit === undefined ? true : await onSubmit(data, name);
        if (result) {
          handleNextStep();
        }
      })
    );

    return () => {
      clearHandleSubmitStep();
    };
  }, [
    active,
    clearHandleSubmitStep,
    handleNextStep,
    handleSubmit,
    name,
    onSubmit,
    setHandleSubmitStep,
    setSavedValues,
  ]);

  return (
    <FormProvider {...context}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            retry={() => {
              setSavedValues(undefined);
              resetErrorBoundary();
            }}
          />
        )}
      >
        {children}
      </ErrorBoundary>
    </FormProvider>
  );
}

export function MultiStepScreen({
  children,
  name,
}: {
  children: ReactElement<StepProps>[];
  name: string;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [store] = useState(() =>
    createStore<MultiStepState>()(
      persist(
        (set) => ({
          activeStep: 0,
          clearHandleSubmitStep: () => set({ handleSubmitStep: undefined }),
          handleNextStep: () =>
            set((state) => ({
              activeStep: Math.min(state.stepCount - 1, state.activeStep + 1),
            })),
          handlePreviousStep: () =>
            set((state) => ({ activeStep: Math.max(0, state.activeStep - 1) })),
          handleSubmitStep: undefined,
          name,
          pagerViewRef: createRef<PagerView>(),
          savedStepData: {},
          saveStepData: (name, data) =>
            set((state) => ({
              savedStepData: {
                ...state.savedStepData,
                [name]: data,
              },
            })),
          setHandleSubmitStep: (handleSubmitStep) => set({ handleSubmitStep }),
          setStepCount: (stepCount) => set({ stepCount }),
          stepCount: 0,
        }),
        {
          name,
          partialize: (state) => ({
            activeStep: state.activeStep,
            savedStepData: state.savedStepData,
          }),
          storage: createJSONStorage(() => zustandStorage),
        }
      )
    )
  );

  const pagerViewRef = useStore(store, (state) => state.pagerViewRef);
  const activeStep = useStore(store, (state) => state.activeStep);
  const setStepCount = useStore(store, (state) => state.setStepCount);

  useEffect(() => {
    pagerViewRef.current?.setPage(activeStep);
  }, [activeStep, pagerViewRef]);

  useEffect(() => {
    setStepCount(Children.count(children));
  }, [children, setStepCount]);

  const active = children[activeStep];
  const next = children[activeStep + 1];

  return (
    <MultiStepContext.Provider value={store}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: t('multistep.title', { title: active?.props?.title }),
        }}
      />
      <Surface style={{ backgroundColor: theme.colors.surface }}>
        <SafeAreaView edges={['top', 'right', 'left']}>
          <MultiStepHeader
            nextTitle={next?.props?.title}
            title={active?.props?.title ?? ''}
          />
        </SafeAreaView>
      </Surface>
      <PagerView
        initialPage={activeStep}
        ref={pagerViewRef}
        scrollEnabled={false}
        style={tw`flex-1`}
      >
        {Children.map(children, (child, index) => (
          <View key={child.props.name} style={tw`flex-1`}>
            <ScrollView style={tw`flex-1`}>
              <SafeAreaView edges={['right', 'left']} style={tw`flex-1`}>
                <ActiveStepContext.Provider value={index === activeStep}>
                  {child}
                </ActiveStepContext.Provider>
              </SafeAreaView>
            </ScrollView>
          </View>
        ))}
      </PagerView>
      <Surface>
        <SafeAreaView edges={['right', 'bottom', 'left']}>
          <MultiStepButtons />
        </SafeAreaView>
      </Surface>
    </MultiStepContext.Provider>
  );
}

function MultiStepButtons() {
  const handleSubmitStep = useMultiStepState((state) => state.handleSubmitStep);
  const handlePreviousStep = useMultiStepState(
    (state) => state.handlePreviousStep
  );

  return (
    <View style={tw`flex-row gap-4 p-4`}>
      <View style={tw`flex-1`}>
        <Button
          mode='contained-tonal'
          onPress={handlePreviousStep}
          style={tw`w-full`}
        >
          <Trans i18nKey='multistep.previous' />
        </Button>
      </View>
      <View style={tw`flex-1`}>
        <Button mode='contained' onPress={handleSubmitStep} style={tw`w-full`}>
          <Trans i18nKey='multistep.next' />
        </Button>
      </View>
    </View>
  );
}

function MultiStepHeader({
  nextTitle,
  title,
}: {
  nextTitle?: string;
  title: string;
}) {
  return (
    <View style={tw`flex-row items-stretch justify-between gap-2 p-4`}>
      <MultiStepProgress />
      <View style={tw`flex-1 items-end justify-start gap-2`}>
        <Text style={tw`font-bold`} variant='headlineSmall'>
          <Trans i18nKey='multistep.title' values={{ title }} />
        </Text>
        {nextTitle && (
          <Text variant='titleSmall'>
            <Trans i18nKey='multistep.nextTitle' values={{ nextTitle }} />
          </Text>
        )}
      </View>
    </View>
  );
}

function MultiStepProgress() {
  const theme = useTheme();
  const activeStep = useMultiStepState((state) => state.activeStep);
  const stepCount = useMultiStepState((state) => state.stepCount);

  return (
    <AnimatedCircularProgress
      backgroundColor={theme.colors.surfaceDisabled}
      fill={((activeStep + 1) / stepCount) * 100}
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
  );
}
