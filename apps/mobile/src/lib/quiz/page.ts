import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizPageId, useQuizPageKey } from '@/components/quiz/page';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { defaultStorage } from '@/lib/mmkv';
import { useQuizScreenKey } from '@/lib/quiz/screen';
import { clearMMKVKeys } from '@/lib/utils';

const atoms = new Map<string, ReturnType<typeof atomFamily>>();

export const quizPageAtomFamily = <T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T
) => {
  const family = atomFamily(
    ({
      pageId,
      pageKey,
      screen,
      screenKey,
      service,
      step,
    }: {
      pageId: string;
      pageKey: string;
      screen: string;
      screenKey: string;
      service: string;
      step: string;
    }) =>
      atomWithMmkvStorage(
        `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:${key}`,
        initialValue,
        schema,
        defaultStorage
      ),
    isEqual
  );

  atoms.set(key, family as ReturnType<typeof atomFamily>);

  return family;
};

export const useQuizPageAtomKeyStatic = ({
  pageId,
  pageKey,
}: {
  pageId: string;
  pageKey: string;
}) => {
  const [_services, service = '', step = '', ...screens] = useLocalSegments();
  const screen = screens.join('.');
  const screenKey = useQuizScreenKey();
  return {
    pageId,
    pageKey,
    screen,
    screenKey,
    service,
    step,
  };
};

export const useQuizPageAtomKey = () => {
  const [_services, service = '', step = '', ...screens] = useLocalSegments();
  const screen = screens.join('.');
  const screenKey = useQuizScreenKey();
  const pageId = useQuizPageId();
  const pageKey = useQuizPageKey();
  return {
    pageId,
    pageKey,
    screen,
    screenKey,
    service,
    step,
  };
};

const PATTERN_ANY = '[^:]*';

export function resetQuizPageAtoms({
  key,
  pageId = PATTERN_ANY,
  pageKey,
  screen = PATTERN_ANY,
  screenKey = PATTERN_ANY,
  service,
  step,
}: {
  key: string;
  pageId?: string;
  pageKey?: string;
  screen?: string;
  screenKey?: string;
  service: string;
  step: string;
}) {
  const exp = new RegExp(
    `^services:(${service}):(${step}):(${screen}):(${screenKey}):(${pageId}):(${pageKey}):(${key})$`
  );
  console.log('Clearing quiz page atoms matching', exp);

  for (const [
    service,
    step,
    screen,
    screenKey,
    pageId,
    pageKey,
    key,
  ] of clearMMKVKeys<[string, string, string, string, string, string, string]>(
    exp,
    defaultStorage
  )) {
    const atom = atoms.get(key);
    if (!atom) {
      console.error(`Unknown quiz page atom key: ${key}`);
      continue;
    }

    atom.remove({
      pageId,
      pageKey,
      screen,
      screenKey,
      service,
      step,
    });
  }
}
