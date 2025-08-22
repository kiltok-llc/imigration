import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import { FieldValues } from 'react-hook-form';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { quizStorage } from '@/lib/mmkv';
import { clearMMKVKeys } from '@/lib/utils';

export const quizValuesAtom = atomFamily(
  ({
    pageId,
    pageKey = '',
    screenId,
    screenKey = '',
    serviceId,
    stepId,
  }: {
    pageId: string;
    pageKey: string | undefined;
    screenId: string;
    screenKey: string | undefined;
    serviceId: string;
    stepId: string;
  }) =>
    atomWithMmkvStorage<FieldValues>(
      `services:${serviceId}:${stepId}:${screenId}:${screenKey}:${pageId}:${pageKey}:values`,
      {},
      z.any(),
      quizStorage
    ),
  isEqual
);

export function resetAllQuizValues() {
  console.log('Clearing ALL quiz values');
  const exp =
    /^services:([^:]+):([^:]+):([^:]+):([^:]+):([^:]+):([^:]+):values$/;

  for (const [
    serviceId,
    stepId,
    screenId,
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
      screenId,
      screenKey,
      serviceId,
      stepId,
    });
  }
}

export function resetQuizValues({
  serviceId,
  stepId,
}: {
  serviceId: string;
  stepId: string;
}) {
  console.log(`Clearing quiz values for ${serviceId}.${stepId}`);
  const exp = new RegExp(
    `^services:${serviceId}:${stepId}:([^:]+):([^:]+):([^:]+):([^:]+):values$`
  );

  for (const [screenId, screenKey, pageId, pageKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizValuesAtom.remove({
      pageId,
      pageKey,
      screenId,
      screenKey,
      serviceId,
      stepId,
    });
  }
}
