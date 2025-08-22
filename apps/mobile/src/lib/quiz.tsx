import { useRouter } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useQuizRouteAtom } from '@/atoms/quiz-route-family';
import { useQuizScreenPageAtom } from '@/atoms/quiz-screen-page-family';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import {
  useCurrentRouteUrl,
  useFinalRouteUrl,
  useIncrementRoute,
  useIsFirstRoute,
  useIsLastRoute,
  useRouteUrls,
} from '@/providers/routes';

export const QuizScreenKeyContext = createContext<string | undefined>(
  undefined
);

type QuizActions = {
  handleBack?: () => void;
  handleContinue?: () => void;
  setHandleBack: (handleBack?: () => void) => void;
  setHandleContinue: (handleContinue?: () => void) => void;
};

const QuizActionsContext = createRequiredContext<QuizActions>();

export const useQuizActions = () => useRequiredContext(QuizActionsContext);

export const useQuizRoutePersistence = () => {
  // Persist valid route
  const routes = useRouteUrls();
  const currentRouteUrl = useCurrentRouteUrl();
  const saveQuizRoute = useSetAtom(useQuizRouteAtom());
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
  const [page, setPage] = useAtom(useQuizScreenPageAtom(screenKey));
  const isLastRoute = useIsLastRoute();
  const finalRouteUrl = useFinalRouteUrl();
  const incrementRoute = useIncrementRoute();
  const router = useRouter();

  return useCallback(() => {
    if (page < pages - 1) {
      void setPage(page + 1);
    } else if (isLastRoute) {
      router.replace(finalRouteUrl);
    } else {
      incrementRoute(1);
    }
  }, [
    finalRouteUrl,
    incrementRoute,
    isLastRoute,
    page,
    pages,
    router,
    setPage,
  ]);
};

export const useHandleQuizScreenPrev = (screenKey: string | undefined) => {
  const [page, setPage] = useAtom(useQuizScreenPageAtom(screenKey));
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
