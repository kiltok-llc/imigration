import { useSetAtom } from 'jotai';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

import { useQuizRouteAtom } from '@/atoms/quiz-route-family';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { useCurrentRouteUrl, useRouteUrls } from '@/providers/routes';

export const QuizScreenKeyContext = createContext<string | undefined>(
  undefined
);

type QuizState = {
  isNextPage: boolean;
  isPrevPage: boolean;
  setIsNextPage: (value: boolean) => void;
  setIsPrevPage: (value: boolean) => void;
};

export const QuizContext = createRequiredContext<StoreApi<QuizState>>();

const useQuizStore = <T,>(selector: (state: QuizState) => T) =>
  useStore(useRequiredContext(QuizContext), selector);

export const useIsNextPage = () => useQuizStore((state) => state.isNextPage);
export const useIsPrevPage = () => useQuizStore((state) => state.isPrevPage);
export const useSetIsNextPage = () =>
  useQuizStore((state) => state.setIsNextPage);
export const useSetIsPrevPage = () =>
  useQuizStore((state) => state.setIsPrevPage);

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
  const [store] = useState(() =>
    createStore<QuizState>()((set) => ({
      isNextPage: false,
      isPrevPage: false,
      setIsNextPage: (isNextPage) => set({ isNextPage }),
      setIsPrevPage: (isPrevPage) => set({ isPrevPage }),
    }))
  );

  useQuizRoutePersistence();

  return <QuizContext.Provider value={store}>{children}</QuizContext.Provider>;
}
