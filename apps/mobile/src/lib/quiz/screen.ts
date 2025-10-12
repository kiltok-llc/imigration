import { isEqual } from '@ver0/deep-equal';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { createContext, useCallback, useContext } from 'react';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useLocalSegments } from '@/hooks/use-local-segments';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { defaultStorage } from '@/lib/mmkv';
import {
  useIncrementRoute,
  useIsFirstRoute,
  useIsLastRoute,
  useOnComplete,
} from '@/lib/routes';
import { clearMMKVKeys } from '@/lib/utils';

const atoms = new Map<string, ReturnType<typeof atomFamily>>();

export const quizScreenAtomFamily = <T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T
) => {
  const family = atomFamily(
    ({
      screen,
      screenKey = '',
      service,
      step,
    }: {
      screen: string;
      screenKey: string;
      service: string;
      step: string;
    }) =>
      atomWithMmkvStorage(
        `services:${service}:${step}:${screen}:${screenKey}:${key}`,
        initialValue,
        schema,
        defaultStorage
      ),
    isEqual
  );

  atoms.set(key, family as ReturnType<typeof atomFamily>);

  return family;
};

const QuizScreenKeyContext = createContext<string>('');
export const QuizScreenKeyProvider = QuizScreenKeyContext.Provider;
export const useQuizScreenKey = () => useContext(QuizScreenKeyContext);

const QuizScreenCurrentPageIdContext = createRequiredContext<string>();
export const QuizScreenCurrentPageIdProvider =
  QuizScreenCurrentPageIdContext.Provider;
export const useQuizScreenCurrentPageId = () =>
  useRequiredContext(QuizScreenCurrentPageIdContext);

export const useQuizScreenAtomKey = () => {
  const [_services, service = '', step = '', ...screens] = useLocalSegments();
  const screen = screens.join('.');
  const screenKey = useQuizScreenKey();
  return {
    screen,
    screenKey,
    service,
    step,
  };
};

const PATTERN_ANY = '[^:]*';

export function resetQuizScreenAtoms({
  key,
  screen = PATTERN_ANY,
  screenKey = PATTERN_ANY,
  service,
  step,
}: {
  key: string;
  screen?: string;
  screenKey?: string;
  service: string;
  step: string;
}) {
  const exp = new RegExp(
    `^services:(${service}):(${step}):(${screen}):(${screenKey}):(${key})$`
  );
  console.log('Clearing quiz screen atoms matching', exp);

  for (const [service, step, screen, screenKey, key] of clearMMKVKeys<
    [string, string, string, string, string]
  >(exp, defaultStorage)) {
    const atom = atoms.get(key);
    if (!atom) {
      console.error(`Unknown quiz page atom key: ${key}`);
      continue;
    }

    atom.remove({
      screen,
      screenKey,
      service,
      step,
    });
  }
}

export const quizScreenCurrentPageIdxAtom = quizScreenAtomFamily(
  'page',
  z.number(),
  0
);

export const useHandleQuizScreenNext = (pages: number) => {
  const [pageIdx, setPageIdx] = useAtom(
    quizScreenCurrentPageIdxAtom(useQuizScreenAtomKey())
  );
  const isLastRoute = useIsLastRoute();
  const onComplete = useOnComplete();
  const incrementRoute = useIncrementRoute();

  return useCallback(() => {
    if (pageIdx < pages - 1) {
      void setPageIdx(pageIdx + 1);
    } else if (isLastRoute) {
      onComplete();
    } else {
      incrementRoute(1);
    }
  }, [onComplete, incrementRoute, isLastRoute, pageIdx, pages, setPageIdx]);
};

export const useHandleQuizScreenPrev = () => {
  const [pageIdx, setPageIdx] = useAtom(
    quizScreenCurrentPageIdxAtom(useQuizScreenAtomKey())
  );
  const isFirstRoute = useIsFirstRoute();
  const router = useRouter();
  const incrementRoute = useIncrementRoute();

  return useCallback(() => {
    if (pageIdx > 0) {
      void setPageIdx(pageIdx - 1);
    } else if (isFirstRoute) {
      router.back();
    } else {
      incrementRoute(-1);
    }
  }, [incrementRoute, isFirstRoute, pageIdx, router, setPageIdx]);
};
