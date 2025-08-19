import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import {
  Children,
  cloneElement,
  createRef,
  isValidElement,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { useQuizPageAtom } from '@/atoms/quiz-page-family';
import { FadeSlotPageWrapper } from '@/components/fade-slot';
import { QuizPageHandle } from '@/components/quiz/page';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import {
  useIsNextPage,
  useIsPrevPage,
  useSetIsNextPage,
  useSetIsPrevPage,
} from '@/lib/quiz';
import {
  useFinalRouteUrl,
  useIncrementRoute,
  useIsFirstRoute,
  useIsLastRoute,
} from '@/providers/routes';

export function QuizScreen({ children }: PropsWithChildren) {
  const router = useRouter();
  const [page, setPage] = useAtom(useQuizPageAtom());
  const keyboardVisible = useKeyboardVisible();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const isNextPage = useIsNextPage();
  const isPrevPage = useIsPrevPage();
  const setIsNextPage = useSetIsNextPage();
  const setIsPrevPage = useSetIsPrevPage();
  const isLastRoute = useIsLastRoute();
  const isFirstRoute = useIsFirstRoute();
  const finalRouteUrl = useFinalRouteUrl();
  const incrementRoute = useIncrementRoute();

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
    setIsSubmitSuccessful(true);
  }, [childRefs, page]);

  const handleSubmit = useCallback(() => {
    if (page < childRefs.length - 1) {
      void setPage(page + 1);
    } else if (isLastRoute) {
      router.replace(finalRouteUrl);
    } else {
      incrementRoute(1);
    }
  }, [
    childRefs.length,
    finalRouteUrl,
    isLastRoute,
    incrementRoute,
    page,
    router,
    setPage,
  ]);

  useEffect(() => {
    if (isSubmitSuccessful && !keyboardVisible) {
      handleSubmit();
      setIsSubmitSuccessful(false);
    }
  }, [handleSubmit, keyboardVisible, isSubmitSuccessful]);

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
      incrementRoute(-1);
    }
  }, [isFirstRoute, page, incrementRoute, router, setPage]);

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
