import { Lens, useLens } from '@hookform/lenses';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useRouter } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import {
  Children,
  cloneElement,
  ComponentProps,
  createRef,
  isValidElement,
  Key,
  PropsWithChildren,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
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
import { Keyboard, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { LinearTransition } from 'react-native-reanimated';
import tw from 'twrnc';
import z from 'zod/v4';

import { useQuizPageAtom } from '@/atoms/quiz-page-family';
import { useQuizValuesAtom } from '@/atoms/quiz-values-family';
import { FadeSlotPageWrapper } from '@/components/fade-slot';
import { useQuiz } from '@/components/quiz/layout';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useStableAtomCallback } from '@/hooks/use-stable-atom-callback';

export type QuizPageHandle = {
  submit: () => Promise<boolean>;
};

const QuizPageContext = createRequiredContext<{
  pageId: string;
}>();

const useQuizPage = () => useRequiredContext(QuizPageContext);

export const useQuizPageId = () => useQuizPage().pageId;

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
  pageKey?: Key;
  ref?: Ref<QuizPageHandle>;
  schema: z.ZodType<Output, Input>;
}) {
  const persistenceKey = pageKey ? `${pageId}.${pageKey}` : pageId;
  const quizValuesAtom = useQuizValuesAtom<Input>(persistenceKey);
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
      //   `Loaded quiz values for ${persistenceKey}:`,
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
      style={[tw`flex-1 px-4 pt-4`, style]}
      {...props}
    >
      <Animated.View layout={LinearTransition} style={tw`gap-16 py-4`}>
        <QuizPageContext.Provider value={{ pageId }}>
          <FormProvider {...context}>
            {children({ ...context, lens })}
          </FormProvider>
        </QuizPageContext.Provider>
      </Animated.View>
    </KeyboardAwareScrollView>
  );
}

export function QuizScreen({ children }: PropsWithChildren) {
  const router = useRouter();
  const [page, setPage] = useAtom(useQuizPageAtom());
  const {
    finalRoute,
    isFirstRoute,
    isLastRoute,
    isNextPage,
    isPrevPage,
    nextRoute,
    prevRoute,
    setIsNextPage,
    setIsPrevPage,
  } = useQuiz();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const childRefs = useMemo(
    () =>
      Array.from(
        { length: Children.toArray(children).length },
        createRef<QuizPageHandle>
      ),
    [children]
  );

  const handleNext = useCallback(async () => {
    const activeChild = childRefs[page]?.current;
    if (!activeChild) {
      console.warn('No active child found for submission.');
      return;
    }

    const result = await activeChild.submit();
    if (!result) {
      return;
    }

    // Need an extra render cycle before submitting, in case the submission
    // logic updates the form.
    setWasSubmitted(true);
  }, [childRefs, page]);

  const handleSubmit = useCallback(() => {
    if (page < childRefs.length - 1) {
      void setPage(page + 1);
    } else if (isLastRoute) {
      router.replace(finalRoute);
    } else {
      nextRoute();
    }
  }, [
    childRefs.length,
    finalRoute,
    isLastRoute,
    nextRoute,
    page,
    router,
    setPage,
  ]);

  useEffect(() => {
    if (wasSubmitted && !keyboardVisible) {
      handleSubmit();
      setWasSubmitted(false);
    }
  }, [handleSubmit, keyboardVisible, wasSubmitted]);

  // Since `handleNext` behavior could depend on state in the page, we want to
  // render the component before calling it.
  useEffect(() => {
    if (isNextPage) {
      void handleNext();
      setIsNextPage(false);
    }
  }, [isNextPage, setIsNextPage, handleNext]);

  const handlePrev = useCallback(() => {
    if (page > 0) {
      void setPage(page - 1);
    } else if (isFirstRoute) {
      router.back();
    } else {
      prevRoute();
    }
  }, [isFirstRoute, page, prevRoute, router, setPage]);

  useEffect(() => {
    if (isPrevPage && !keyboardVisible) {
      handlePrev();
      setIsPrevPage(false);
    }
  }, [handlePrev, isPrevPage, keyboardVisible, setIsPrevPage]);

  return (
    <FadeSlotPageWrapper>
      <ReactivePagerView orientation='vertical' page={page} style={tw`flex-1`}>
        {Children.toArray(children).map((child, idx) => (
          <View key={idx} style={tw`flex-1`}>
            {isValidElement(child)
              ? cloneElement(child, {
                  ref: childRefs[idx],
                } as any)
              : child}
          </View>
        ))}
      </ReactivePagerView>
    </FadeSlotPageWrapper>
  );
}
