import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { quizStorage } from '@/lib/mmkv';
import { clearMMKVKeys } from '@/lib/utils';

export const quizValuesAtom = atomFamily(
  ({
    pageId,
    pageKey = '',
    screen,
    screenKey = '',
    service,
    step,
  }: {
    pageId: string;
    pageKey: string | undefined;
    screen: string;
    screenKey: string | undefined;
    service: string;
    step: string;
  }) =>
    atomWithMmkvStorage(
      `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:values`,
      null,
      z.looseObject({}).nullable(),
      quizStorage
    ),
  isEqual
);

export function resetAllQuizValues() {
  console.log('Clearing ALL quiz values');
  const exp =
    /^services:([^:]+):([^:]+):([^:]+):([^:]+):([^:]+):([^:]+):values$/;

  for (const [
    service,
    step,
    screen,
    screenKey,
    pageId,
    pageKey,
  ] of clearMMKVKeys<[string, string, string, string, string, string]>(
    exp,
    quizStorage
  )) {
    quizValuesAtom.remove({
      pageId,
      pageKey,
      screen,
      screenKey,
      service,
      step,
    });
  }
}

export function resetQuizValues({
  service,
  step,
}: {
  service: string;
  step: string;
}) {
  console.log(`Clearing quiz values for ${service}.${step}`);
  const exp = new RegExp(
    `^services:${service}:${step}:([^:]+):([^:]+):([^:]+):([^:]+):values$`
  );

  for (const [screen, screenKey, pageId, pageKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizValuesAtom.remove({
      pageId,
      pageKey,
      screen,
      screenKey,
      service,
      step,
    });
  }
}
