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
    service,
    step,
  }: {
    pageId: string;
    pageKey: string | undefined;
    screenId: string;
    screenKey: string | undefined;
    service: string;
    step: string;
  }) =>
    atomWithMmkvStorage<FieldValues>(
      `services:${service}:${step}:${screenId}:${screenKey}:${pageId}:${pageKey}:values`,
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
    service,
    step,
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

  for (const [screenId, screenKey, pageId, pageKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizValuesAtom.remove({
      pageId,
      pageKey,
      screenId,
      screenKey,
      service,
      step,
    });
  }
}
