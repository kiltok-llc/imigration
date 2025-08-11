import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useRouter } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import {
  Children,
  cloneElement,
  ComponentProps,
  createRef,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import z from 'zod/v4';

import { useQuizPageAtom } from '@/atoms/quiz-page-family';
import { useQuizValuesAtom } from '@/atoms/quiz-values-family';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { useQuizRoutes } from '@/components/ui/quiz/layout';
import { createRequiredContext } from '@/hooks/use-required-context';
import { useRouteNavigation } from '@/hooks/use-route-navigation';
import { useStableAtomCallback } from '@/hooks/use-stable-atom-callback';

type QuizPageElement = ReactElement<{ ref: Ref<QuizPageHandle> }>;

type QuizPageHandle = {
  submit: () => Promise<boolean>;
};

export function QuizPage<Input extends FieldValues, Output>({
  children,
  contentContainerStyle,
  defaultValues,
  formOptions = {},
  onSubmit,
  pageId,
  ref = null,
  schema,
  style,
  ...props
}: Omit<ComponentProps<typeof ScrollView>, 'children'> & {
  children:
    | ((context: UseFormReturn<Input, any, Output>) => ReactNode)
    | ReactNode;
  defaultValues: Input;
  formOptions?: UseFormProps<Input, any, Output>;
  onSubmit: (data: Output) => boolean;
  pageId: null | string;
  ref?: Ref<QuizPageHandle>;
  schema: z.ZodType<Output, Input>;
}) {
  const quizValuesAtom = useQuizValuesAtom<Input>(pageId);
  const setPersistedValues = useSetAtom(quizValuesAtom);

  const context = useForm<Input, any, Output>({
    defaultValues: defaultValues as DefaultValues<Input>,
    resolver: standardSchemaResolver<Input, any, Output>(schema),
    ...formOptions,
  });
  const { handleSubmit, reset, subscribe } = context;

  const loadQuizValues = useStableAtomCallback(
    (get) => {
      const persistedValues = get(quizValuesAtom);
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
    <ScrollView
      contentContainerStyle={[
        tw`grow-1 justify-center gap-4 py-4`,
        contentContainerStyle,
      ]}
      style={[tw`mx-4 flex-1`, style]}
      {...props}
    >
      <FormProvider {...context}>
        {typeof children === 'function' ? children(context) : children}
      </FormProvider>
    </ScrollView>
  );
}

const QuizContext = createRequiredContext<{
  handleNext: () => void;
  handlePrev: () => void;
}>();

export function QuizScreen({
  children,
}: {
  children: QuizPageElement | QuizPageElement[];
}) {
  const router = useRouter();
  const [page, setPage] = useAtom(useQuizPageAtom());
  const { finalRoute, routes } = useQuizRoutes();
  const { isFirstRoute, isLastRoute, nextRoute, prevRoute } =
    useRouteNavigation(routes);

  const childRefs = useMemo(
    () =>
      Array.from(
        { length: Children.count(children) },
        createRef<QuizPageHandle>
      ),
    [children]
  );

  const handleNext = useCallback(() => {
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

  const handleSubmit = useCallback(async () => {
    const activeChild = childRefs[page]?.current;
    if (!activeChild) {
      console.warn('No active child found for submission.');
      return;
    }

    const result = await activeChild.submit();
    if (result) {
      handleNext();
    }
  }, [childRefs, handleNext, page]);

  const handlePrev = useCallback(() => {
    if (page > 0) {
      void setPage(page - 1);
    } else if (isFirstRoute) {
      router.back();
    } else {
      prevRoute();
    }
  }, [page, isFirstRoute, setPage, router, prevRoute]);

  return (
    <QuizContext.Provider value={{ handleNext, handlePrev }}>
      <SafeAreaView
        edges={['left', 'bottom', 'right']}
        style={tw`flex-1 gap-4`}
      >
        <ReactivePagerView
          orientation='vertical'
          page={page}
          style={tw`flex-1`}
        >
          {Children.map(children, (child, index) => (
            <View key={index}>
              {cloneElement(child, {
                ref: childRefs[index],
              })}
            </View>
          ))}
        </ReactivePagerView>
        <View style={tw`mx-4 mt-auto flex-row gap-4`}>
          <View style={tw`flex-1`}>
            <Button
              icon='arrow-left'
              mode='contained-tonal'
              onPress={handlePrev}
            >
              <Trans i18nKey='quiz.back' />
            </Button>
          </View>
          <View style={tw`flex-1`}>
            <Button
              contentStyle={tw`flex-row-reverse`}
              icon='arrow-right'
              mode='contained'
              onPress={handleSubmit}
            >
              <Trans i18nKey='quiz.continue' />
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </QuizContext.Provider>
  );
}
