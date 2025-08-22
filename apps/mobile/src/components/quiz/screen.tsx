import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import {
  Children,
  cloneElement,
  createRef,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
} from 'react';
import { Keyboard, View } from 'react-native';
import tw from 'twrnc';

import { quizPageAtom } from '@/atoms/quiz-page-atom';
import { FadeSlotPageWrapper } from '@/components/fade-slot';
import { QuizPageHandle } from '@/components/quiz/page';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { useScreen } from '@/hooks/use-screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import {
  QuizScreenKeyContext,
  useHandleQuizScreenNext,
  useHandleQuizScreenPrev,
  useQuizActions,
} from '@/lib/quiz';

type QuizPageProps = { ref: RefObject<null | QuizPageHandle> };

export const useChildRefs = (children: ReactNode) =>
  useMemo(
    () =>
      Array.from(
        { length: Children.toArray(children).length },
        createRef<QuizPageHandle>
      ),
    [children]
  );

export function QuizScreen({
  children,
  screenKey,
}: PropsWithChildren<{ screenKey?: string }>) {
  const screenId = useScreen();
  const service = useService();
  const step = useStep();
  const page = useAtomValue(
    quizPageAtom({ screenId, screenKey, service, step })
  );
  const keyboardVisible = useKeyboardVisible();
  const childRefs = useChildRefs(children);
  const handleQuizScreenNext = useHandleQuizScreenNext(
    childRefs.length,
    screenKey
  );
  const handleQuizScreenPrev = useHandleQuizScreenPrev(screenKey);
  const { setHandleBack, setHandleContinue } = useQuizActions();

  const {
    data: submissionResult,
    mutate: handleSubmit,
    reset: resetSubmit,
  } = useMutation({
    async mutationFn() {
      Keyboard.dismiss();

      const activeChild = childRefs[page]?.current;
      if (!activeChild) {
        console.warn('No active child found for submission.');
        return false;
      }

      return await activeChild.submit();
    },
  });

  const {
    isSuccess: isBackSuccess,
    mutate: handleBack,
    reset: resetBack,
  } = useMutation({
    async mutationFn() {
      Keyboard.dismiss();
    },
  });

  useEffect(() => {
    setHandleBack(handleBack);
    setHandleContinue(handleSubmit);

    return () => {
      setHandleBack();
      setHandleContinue();
    };
  }, [handleBack, handleSubmit, setHandleBack, setHandleContinue]);

  useEffect(() => {
    if (submissionResult === true && !keyboardVisible) {
      resetSubmit();
      handleQuizScreenNext();
    }
  }, [handleQuizScreenNext, keyboardVisible, submissionResult, resetSubmit]);

  useEffect(() => {
    if (isBackSuccess && !keyboardVisible) {
      resetBack();
      handleQuizScreenPrev();
    }
  }, [handleQuizScreenPrev, keyboardVisible, isBackSuccess, resetBack]);

  return (
    <QuizScreenKeyContext.Provider value={screenKey}>
      <FadeSlotPageWrapper>
        <ReactivePagerView
          orientation='vertical'
          page={page}
          style={tw`flex-1`}
        >
          {Children.toArray(children).map((child, idx) => (
            <View key={idx} style={tw`flex-1`}>
              {isValidElement<QuizPageProps>(child)
                ? cloneElement(child, {
                    ref: childRefs[idx],
                  })
                : child}
            </View>
          ))}
        </ReactivePagerView>
      </FadeSlotPageWrapper>
    </QuizScreenKeyContext.Provider>
  );
}
