import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { quizStorage } from '@/lib/mmkv';
import { clearMMKVKeys } from '@/lib/utils';

type QuizScreenPageParam = {
  quizId: string;
  screenId: string;
  screenKey: string;
  serviceId: string;
};

const quizScreenPageKey = ({
  quizId,
  screenId,
  screenKey,
  serviceId,
}: QuizScreenPageParam) =>
  `services:${serviceId}:${quizId}:${screenId}:${screenKey}:page`;

export const quizScreenPageFamily = atomFamily(
  (param: QuizScreenPageParam) =>
    atomWithMmkvStorage(quizScreenPageKey(param), 0, z.number(), quizStorage),
  isEqual
);

export const useQuizScreenPageAtom = (screenKey: string = '') => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  return quizScreenPageFamily({ quizId, screenId, screenKey, serviceId });
};

export function resetAllQuizPages() {
  console.log('Clearing ALL quiz pages');

  const exp = /^services:([^.]+):([^.]+):(.+):([^.]+):page$/;
  for (const [serviceId, quizId, screenId, screenKey] of clearMMKVKeys<
    [string, string, string, string]
  >(exp, quizStorage)) {
    quizScreenPageFamily.remove({
      quizId,
      screenId,
      screenKey,
      serviceId,
    });
  }
}

export function resetQuizPage({
  quizId,
  serviceId,
}: {
  quizId: string;
  serviceId: string;
}) {
  console.log(`Clearing quiz pages for ${serviceId}.${quizId}`);

  const exp = new RegExp(`^services:${serviceId}:${quizId}:(.+):([^.]+):page$`);
  for (const [screenId, screenKey] of clearMMKVKeys<[string, string]>(
    exp,
    quizStorage
  )) {
    quizScreenPageFamily.remove({
      quizId,
      screenId,
      screenKey,
      serviceId,
    });
  }
}

export const useResetQuizPage = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizPage({ quizId, serviceId });
};
