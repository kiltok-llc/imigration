import { Lens, useLens } from '@hookform/lenses';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import * as Updates from 'expo-updates';
import { PrimitiveAtom, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import {
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import {
  Control,
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import tw from 'twrnc';
import z from 'zod/v4';

import { QuizPageIdProvider } from '@/components/quiz/screen';
import { Button } from '@/components/ui/button';
import { useScreen } from '@/hooks/use-screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { useQuizScreenKey } from '@/lib/quiz/screen';
import { quizValuesAtom } from '@/lib/quiz/values';

export type QuizPageHandle = {
  reset: () => void;
  submit: () => Promise<boolean>;
};

export type QuizPageProps<
  Input extends FieldValues = FieldValues,
  Output = any,
> = {
  children?: (
    context: UseFormReturn<Input, any, Output> & { lens: Lens<Input> }
  ) => ReactNode;
  defaultValues?: Input;
  formOptions?: UseFormProps<Input, any, Output>;
  onSubmit?: (data: Output) => boolean;
  onSuccess?: (data: Output) => void;
  pageId: string;
  pageKey?: string;
  ref?: Ref<QuizPageHandle>;
  sampleData?: Record<string, Input>;
  schema?: z.ZodType<Output, Input>;
};

export function QuizPage<Input extends FieldValues, Output>({
  children,
  defaultValues,
  formOptions = {},
  onSubmit = () => true,
  onSuccess,
  pageId,
  pageKey,
  ref = null,
  sampleData = {},
  schema,
  ...props
}: QuizPageProps<Input, Output>) {
  const service = useService();
  const screen = useScreen();
  const step = useStep();
  const screenKey = useQuizScreenKey();
  const valuesAtom = quizValuesAtom({
    pageId,
    pageKey,
    screen,
    screenKey,
    service,
    step,
  }) as PrimitiveAtom<Input>;
  const setPersistedValues = useSetAtom(valuesAtom);

  const context = useForm<Input, any, Output>({
    defaultValues: defaultValues as DefaultValues<Input>,
    resolver: standardSchemaResolver<Input, any, Output>(schema!),
    ...formOptions,
  });
  const { control, handleSubmit, reset, subscribe } = context;

  const lens = useLens<Input>({
    control: control as unknown as Control<Input>,
  });

  const loadQuizValues = useAtomCallback(
    useCallback(
      (get) => {
        const persistedValues = get(valuesAtom);
        console.debug(`Loaded quiz values`, persistedValues);
        reset(persistedValues ?? undefined, { keepDefaultValues: true });
      },
      [valuesAtom, reset]
    )
  );

  useEffect(() => {
    loadQuizValues();
  }, [loadQuizValues]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      reset(defaultValues);
    },
    submit: async () => {
      let result = false;
      await handleSubmit(
        (data) => {
          console.debug('Passed validation!', data);
          result = onSubmit(data);
          if (result && onSuccess) {
            onSuccess(data);
          }
        },
        (errors) => {
          console.debug('Failed validation!', errors);
          result = false;
        }
      )();
      return result;
    },
  }));

  useEffect(
    () =>
      subscribe({
        callback({ values }) {
          setPersistedValues(values);
        },
        formState: {
          values: true,
        },
      }),
    [subscribe, setPersistedValues]
  );

  return (
    <QuizPageIdProvider value={pageId}>
      <KeyboardAwareScrollView
        bottomOffset={80}
        contentContainerStyle={tw`grow justify-center`}
        disableScrollOnKeyboardHide={true}
        scrollsToTop={false}
        style={tw`flex-1 px-4 pt-4`}
        {...props}
      >
        <Animated.View layout={LinearTransition} style={tw`gap-16 py-16`}>
          <FormProvider {...context}>
            {children?.({ ...context, lens })}
            {Updates.channel !== 'production' &&
              Object.entries(sampleData).map(([key, data]) => (
                <Button
                  key={key}
                  mode='contained-tonal'
                  onPress={() => {
                    toast.success(`Loaded ${key} data`);
                    reset(data, {
                      keepDefaultValues: true,
                    });
                  }}
                  size='sm'
                >
                  Load {key} data
                </Button>
              ))}
          </FormProvider>
        </Animated.View>
      </KeyboardAwareScrollView>
    </QuizPageIdProvider>
  );
}
