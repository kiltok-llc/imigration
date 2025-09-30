import { useMutation } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import {
  Children,
  cloneElement,
  createContext,
  createRef,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Keyboard, View } from 'react-native';
import tw from 'twrnc';

import { FadeSlotPageWrapper } from '@/components/fade-slot';
import { QuizPageHandle, QuizPageProps } from '@/components/quiz/page';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import { useDevMenuItem } from '@/hooks/use-dev-menu-items';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { useScreen } from '@/hooks/use-screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { useQuizActions } from '@/lib/quiz/actions';
import { quizPageAtom } from '@/lib/quiz/page';
import {
  useHandleQuizScreenNext,
  useHandleQuizScreenPrev,
  useSyncScreenKey,
} from '@/lib/quiz/screen';
import { useT } from '@/lib/translation';

const QuizPageIdContext = createContext<string>('');
export const QuizPageIdProvider = QuizPageIdContext.Provider;
export const useQuizPageId = () => useContext(QuizPageIdContext);

const quizCurrentPageIdAtom = atomWithReset('');
export const useQuizCurrentPageId = () => useAtomValue(quizCurrentPageIdAtom);

export const useChildRefs = (children: ReactNode) =>
  useMemo(
    () =>
      Array.from(
        { length: Children.toArray(children).length },
        createRef<QuizPageHandle>
      ),
    [children]
  );

const useSyncCurrentPageId = (children: ReactNode, page: number) => {
  const pages = Children.toArray(children).filter((child) =>
    isValidElement<QuizPageProps>(child)
  );
  const pageId = pages[page]?.props?.pageId;

  const setPageId = useSetAtom(quizCurrentPageIdAtom);
  const resetPageId = useResetAtom(quizCurrentPageIdAtom);
  useEffect(() => {
    setPageId(pageId ?? '');
    return resetPageId;
  }, [pageId, resetPageId, setPageId]);
};

export function QuizScreen({
  children,
  screenKey,
}: PropsWithChildren<{ screenKey?: string }>) {
  useSyncScreenKey(screenKey);

  const t = useT();

  const screen = useScreen();
  const service = useService();
  const step = useStep();
  const page = useAtomValue(quizPageAtom({ screen, screenKey, service, step }));
  const keyboardVisible = useKeyboardVisible();
  const childRefs = useChildRefs(children);
  const handleQuizScreenNext = useHandleQuizScreenNext(
    childRefs.length,
    screenKey
  );
  const handleQuizScreenPrev = useHandleQuizScreenPrev(screenKey);
  const { setHandleBack, setHandleContinue } = useQuizActions();

  useDevMenuItem(
    useCallback(
      () => ({
        callback: () => {
          childRefs[page]?.current?.reset();
        },
        name: 'Reset Quiz Page Values',
        shouldCollapse: true,
      }),
      [childRefs, page]
    )
  );

  useSyncCurrentPageId(children, page);

  const {
    data: submissionResult,
    mutate: handleSubmit,
    reset: resetSubmit,
  } = useMutation({
    meta: {
      errorToast: t('quiz.toast.error'),
    },
    async mutationFn() {
      Keyboard.dismiss();

      const activeChild = childRefs[page]?.current;
      if (!activeChild) {
        console.log('No active child found for submission.');
        return true;
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
    <FadeSlotPageWrapper>
      <ReactivePagerView orientation='vertical' page={page} style={tw`flex-1`}>
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
  );
}
