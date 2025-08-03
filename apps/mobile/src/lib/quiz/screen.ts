import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useScreen } from '@/hooks/use-screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { quizPageAtom } from '@/lib/quiz/page';
import {
  useIncrementRoute,
  useIsFirstRoute,
  useIsLastRoute,
  useOnComplete,
} from '@/lib/routes';

const quizScreenKeyAtom = atomWithReset('');

export const useQuizScreenKey = () => useAtomValue(quizScreenKeyAtom);

export const useSyncScreenKey = (screenKey: string | undefined) => {
  const setScreenKey = useSetAtom(quizScreenKeyAtom);
  const resetScreenKey = useResetAtom(quizScreenKeyAtom);
  useEffect(() => {
    setScreenKey(screenKey ?? '');
    return resetScreenKey;
  }, [resetScreenKey, screenKey, setScreenKey]);
};
export const useHandleQuizScreenNext = (
  pages: number,
  screenKey: string | undefined
) => {
  const service = useService();
  const step = useStep();
  const screen = useScreen();
  const [page, setPage] = useAtom(
    quizPageAtom({ screen, screenKey, service, step })
  );
  const isLastRoute = useIsLastRoute();
  const onComplete = useOnComplete();
  const incrementRoute = useIncrementRoute();

  return useCallback(() => {
    if (page < pages - 1) {
      void setPage(page + 1);
    } else if (isLastRoute) {
      onComplete();
    } else {
      incrementRoute(1);
    }
  }, [onComplete, incrementRoute, isLastRoute, page, pages, setPage]);
};
export const useHandleQuizScreenPrev = (screenKey: string | undefined) => {
  const service = useService();
  const step = useStep();
  const screen = useScreen();
  const [page, setPage] = useAtom(
    quizPageAtom({ screen, screenKey, service, step })
  );
  const isFirstRoute = useIsFirstRoute();
  const router = useRouter();
  const incrementRoute = useIncrementRoute();

  return useCallback(() => {
    if (page > 0) {
      void setPage(page - 1);
    } else if (isFirstRoute) {
      router.back();
    } else {
      incrementRoute(-1);
    }
  }, [incrementRoute, isFirstRoute, page, router, setPage]);
};
