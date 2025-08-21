import { isEqual } from '@ver0/deep-equal';
import { PrimitiveAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useContext } from 'react';
import { FieldValues } from 'react-hook-form';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { quizStorage } from '@/lib/mmkv';
import { QuizScreenKeyContext } from '@/lib/quiz';
import { clearMMKVKeys } from '@/lib/utils';

type QuizValuesParam = {
  pageId: string;
  pageKey: string;
  quizId: string;
  screenId: string;
  screenKey: string;
  serviceId: string;
};

const quizValuesKey = ({
  pageId,
  quizId,
  screenId,
  screenKey,
  serviceId,
}: QuizValuesParam) =>
  `services.${serviceId}.${quizId}.${screenId}.${pageId}.${screenKey}.values`;

export const quizPageValues = atomFamily(
  (param: QuizValuesParam) =>
    atomWithMmkvStorage<FieldValues>(
      quizValuesKey(param),
      {},
      z.any(),
      quizStorage
    ),
  isEqual
);

export const useQuizValuesAtom = <T>(pageId: string, pageKey: string = '') => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const screenKey = useContext(QuizScreenKeyContext) ?? '';

  return quizPageValues({
    pageId,
    pageKey,
    quizId,
    screenId,
    screenKey,
    serviceId,
  }) as PrimitiveAtom<T>;
};

export function resetAllQuizValues() {
  console.log('Clearing ALL quiz values');
  const exp =
    /^services\.([^.]+)\.([^.]+)\.(.+)\.([^.]+)\.([^.]+).([^.]+)\.values$/;
  for (const [
    serviceId,
    quizId,
    screenId,
    screenKey,
    pageId,
    pageKey,
  ] of clearMMKVKeys<[string, string, string, string, string, string]>(
    exp,
    quizStorage
  )) {
    quizPageValues.remove({
      pageId,
      pageKey,
      quizId,
      screenId,
      screenKey,
      serviceId,
    });
  }
}

export function resetQuizValues({
  quizId,
  serviceId,
}: {
  quizId: string;
  serviceId: string;
}) {
  console.log(`Clearing quiz values for ${serviceId}.${quizId}`);

  const exp = new RegExp(
    `^services:${serviceId}:${quizId}:(.+):([^.]+):([^.]+):([^.]+):values$`
  );
  for (const [screenId, screenKey, pageId, pageKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizPageValues.remove({
      pageId,
      pageKey,
      quizId,
      screenId,
      screenKey,
      serviceId,
    });
  }
}

export const useResetQuizValues = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizValues({ quizId, serviceId });
};
