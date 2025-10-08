import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
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
import { MigriButton } from '@/components/migri/migri-talk-button';
import { QuizPageHandle, QuizPageProps } from '@/components/quiz/page';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import { useDevMenuItem } from '@/hooks/use-dev-menu-items';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { useLocalSegments } from '@/hooks/use-local-segments';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useQuizActions } from '@/lib/quiz/actions';
import {
  quizScreenCurrentPageIdxAtom,
  useHandleQuizScreenNext,
  useHandleQuizScreenPrev,
  useQuizScreenAtomKey,
} from '@/lib/quiz/screen';
import { useT } from '@/lib/translation';

export const useChildRefs = (children: ReactNode) =>
  useMemo(
    () =>
      Array.from(
        { length: Children.toArray(children).length },
        createRef<QuizPageHandle>
      ),
    [children]
  );

const useCurrentPageId = (children: ReactNode, page: number) =>
  Children.toArray(children).filter((child) =>
    isValidElement<QuizPageProps>(child)
  )[page]?.props?.pageId ?? '';

const QuizScreenKeyContext = createContext<string>('');
export const QuizScreenKeyProvider = QuizScreenKeyContext.Provider;
export const useQuizScreenKey = () => useContext(QuizScreenKeyContext);

const QuizScreenCurrentPageIdContext = createRequiredContext<string>();
export const useQuizScreenCurrentPageId = () =>
  useRequiredContext(QuizScreenCurrentPageIdContext);

export function QuizScreen({
  children,
  migriFAB = true,
}: PropsWithChildren<{
  migriFAB?: boolean;
}>) {
  const t = useT();

  const [_services, service = '', step = '', ...screens] = useLocalSegments();
  const screen = screens.join('.');
  const pageIdx = useAtomValue(
    quizScreenCurrentPageIdxAtom(useQuizScreenAtomKey())
  );
  const keyboardVisible = useKeyboardVisible();
  const childRefs = useChildRefs(children);
  const handleQuizScreenNext = useHandleQuizScreenNext(childRefs.length);
  const handleQuizScreenPrev = useHandleQuizScreenPrev();
  const { setHandleBack, setHandleContinue } = useQuizActions();

  useDevMenuItem(
    useCallback(
      () => ({
        callback: () => {
          childRefs[pageIdx]?.current?.reset();
        },
        name: 'Reset Quiz Page Values',
        shouldCollapse: true,
      }),
      [childRefs, pageIdx]
    )
  );

  const currentPageId = useCurrentPageId(children, pageIdx);

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

      const activeChild = childRefs[pageIdx]?.current;
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
    <QuizScreenCurrentPageIdContext.Provider value={currentPageId}>
      <FadeSlotPageWrapper>
        <ReactivePagerView
          orientation='vertical'
          page={pageIdx}
          style={tw`flex-1`}
        >
          {Children.toArray(children).map((child, idx) => (
            <View key={idx} style={tw`flex-1`}>
              {isValidElement<QuizPageProps>(child)
                ? cloneElement(child, {
                    pageRef: childRefs[idx],
                  })
                : child}
            </View>
          ))}
        </ReactivePagerView>
        {migriFAB && (
          <MigriButton
            float
            id={`services.${service}.${step}.${screen}.${currentPageId}`}
            style={tw`right-4 bottom-4`}
          />
        )}
      </FadeSlotPageWrapper>
    </QuizScreenCurrentPageIdContext.Provider>
  );
}
