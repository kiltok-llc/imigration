import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { quizStorage } from '@/lib/mmkv';
import { clearMMKVKeys } from '@/lib/utils';

export const quizPageAtom = atomFamily(
  ({
    screen,
    screenKey = '',
    service,
    step,
  }: {
    screen: string;
    screenKey: string | undefined;
    service: string;
    step: string;
  }) =>
    atomWithMmkvStorage(
      `services:${service}:${step}:${screen}:${screenKey}:page`,
      0,
      z.number(),
      quizStorage
    ),
  isEqual
);

export function resetAllQuizPages() {
  console.log('Clearing ALL quiz pages');

  const exp = /^services:([^:]+):([^:]+):([^:]+):([^:]+):page$/;
  for (const [service, step, screen, screenKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizPageAtom.remove({
      screen,
      screenKey,
      service,
      step,
    });
  }
}

export function resetQuizPages({
  service,
  step,
}: {
  service: string;
  step: string;
}) {
  console.log(`Clearing quiz pages for ${service}.${step}`);

  const exp = new RegExp(`^services:${service}:${step}:([^:]+):([^:]+):page$`);
  for (const [screen, screenKey] of clearMMKVKeys<[string, string]>(
    exp,
    quizStorage
  )) {
    quizPageAtom.remove({
      screen,
      screenKey,
      service,
      step,
    });
  }
}
