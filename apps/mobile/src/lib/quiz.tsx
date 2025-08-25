import { useRouter } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { quizPageAtom } from '@/atoms/quiz-page-atom';
import { quizRouteAtom } from '@/atoms/quiz-route-atom';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useScreen } from '@/hooks/use-screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import {
  useCurrentRouteUrl,
  useIncrementRoute,
  useIsFirstRoute,
  useIsLastRoute,
  useOnComplete,
  useRouteUrls,
} from '@/providers/routes';

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

type QuizActions = {
  handleBack?: () => void;
  handleContinue?: () => void;
  setHandleBack: (handleBack?: () => void) => void;
  setHandleContinue: (handleContinue?: () => void) => void;
};

const QuizActionsContext = createRequiredContext<QuizActions>();

export const useQuizActions = () => useRequiredContext(QuizActionsContext);

export const useQuizRoutePersistence = () => {
  const service = useService();
  const step = useStep();
  const routes = useRouteUrls();
  const currentRouteUrl = useCurrentRouteUrl();
  const saveQuizRoute = useSetAtom(quizRouteAtom({ service, step }));
  useEffect(() => {
    if (routes.includes(currentRouteUrl)) {
      saveQuizRoute(currentRouteUrl);
    }
  }, [currentRouteUrl, routes, saveQuizRoute]);
};

export function QuizProvider({ children }: PropsWithChildren) {
  const [handleBack, setHandleBack] = useState<() => void>();
  const [handleContinue, setHandleContinue] = useState<() => void>();

  useQuizRoutePersistence();

  return (
    <QuizActionsContext.Provider
      value={{
        handleBack,
        handleContinue,
        setHandleBack: (handler) => setHandleBack(() => handler),
        setHandleContinue: (handler) => setHandleContinue(() => handler),
      }}
    >
      {children}
    </QuizActionsContext.Provider>
  );
}

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
