import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { quizStorage } from '@/lib/mmkv';
import { clearMMKVKeys } from '@/lib/utils';

export const quizPageAtom = atomFamily(
  ({
    screenId,
    screenKey = '',
    serviceId,
    stepId,
  }: {
    screenId: string;
    screenKey: string | undefined;
    serviceId: string;
    stepId: string;
  }) =>
    atomWithMmkvStorage(
      `services:${serviceId}:${stepId}:${screenId}:${screenKey}:page`,
      0,
      z.number(),
      quizStorage
    ),
  isEqual
);

export function resetAllQuizPages() {
  console.log('Clearing ALL quiz pages');

  const exp = /^services:([^:]+):([^:]+):([^:]+):([^:]+):page$/;
  for (const [serviceId, stepId, screenId, screenKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizPageAtom.remove({
      screenId,
      screenKey,
      serviceId,
      stepId,
    });
  }
}

export function resetQuizPage({
  serviceId,
  stepId,
}: {
  serviceId: string;
  stepId: string;
}) {
  console.log(`Clearing quiz pages for ${serviceId}.${stepId}`);

  const exp = new RegExp(
    `^services:${serviceId}:${stepId}:([^:]+):([^:]+):page$`
  );
  for (const [screenId, screenKey] of clearMMKVKeys<[string, string]>(
    exp,
    quizStorage
  )) {
    quizPageAtom.remove({
      screenId,
      screenKey,
      serviceId,
      stepId,
    });
  }
}
