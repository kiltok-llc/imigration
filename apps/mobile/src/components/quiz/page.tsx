import { Lens, useLens } from '@hookform/lenses';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useSetAtom } from 'jotai';
import {
  ComponentProps,
  ReactNode,
  Ref,
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
import { ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { LinearTransition } from 'react-native-reanimated';
import tw from 'twrnc';
import z from 'zod/v4';

import { useQuizValuesAtom } from '@/atoms/quiz-page-values';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useStableAtomCallback } from '@/hooks/use-stable-atom-callback';

export type QuizPageHandle = {
  submit: () => Promise<boolean>;
};

const QuizPageIdContext = createRequiredContext<string>();

export const useQuizPageId = () => useRequiredContext(QuizPageIdContext);

export function QuizPage<Input extends FieldValues, Output>({
  children,
  contentContainerStyle,
  defaultValues,
  formOptions = {},
  onSubmit,
  pageId,
  pageKey,
  ref = null,
  schema,
  style,
  ...props
}: Omit<ComponentProps<typeof ScrollView>, 'children'> & {
  children: (
    context: UseFormReturn<Input, any, Output> & { lens: Lens<Input> }
  ) => ReactNode;
  defaultValues: Input;
  formOptions?: UseFormProps<Input, any, Output>;
  onSubmit: (data: Output) => boolean;
  pageId: string;
  pageKey?: string;
  ref?: Ref<QuizPageHandle>;
  schema: z.ZodType<Output, Input>;
}) {
  const quizValuesAtom = useQuizValuesAtom<Input>(pageId, pageKey);
  const setPersistedValues = useSetAtom(quizValuesAtom);

  const context = useForm<Input, any, Output>({
    defaultValues: defaultValues as DefaultValues<Input>,
    resolver: standardSchemaResolver<Input, any, Output>(schema),
    ...formOptions,
  });
  const { control, handleSubmit, reset, subscribe } = context;

  const lens = useLens<Input>({
    control: control as unknown as Control<Input>,
  });

  const loadQuizValues = useStableAtomCallback(
    (get) => {
      const persistedValues = get(quizValuesAtom);
      // console.debug(
      //   `Loaded quiz values for ${pageId}:${pageKey}`,
      //   persistedValues
      // );
      if (persistedValues) {
        reset(persistedValues, {
          keepDefaultValues: true,
          keepDirtyValues: true,
        });
      }
    },
    [quizValuesAtom, reset]
  );

  useEffect(() => {
    loadQuizValues();
  }, [loadQuizValues]);

  useImperativeHandle(ref, () => ({
    async submit() {
      let result = false;
      await handleSubmit(
        (data) => {
          console.debug('Passed validation!', data);
          result = onSubmit(data);
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
    <KeyboardAwareScrollView
      bottomOffset={80}
      contentContainerStyle={[tw`grow justify-center`, contentContainerStyle]}
      disableScrollOnKeyboardHide={true}
      scrollsToTop={false}
      style={[tw`flex-1 px-4 pt-4`, style]}
      {...props}
    >
      <Animated.View layout={LinearTransition} style={tw`gap-16 py-4`}>
        <QuizPageIdContext.Provider value={pageId}>
          <FormProvider {...context}>
            {children({ ...context, lens })}
          </FormProvider>
        </QuizPageIdContext.Provider>
      </Animated.View>
    </KeyboardAwareScrollView>
  );
}
