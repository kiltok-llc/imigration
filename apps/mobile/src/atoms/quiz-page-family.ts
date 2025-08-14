import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { clearMMKVKeys } from '@/lib/utils';

type QuizPageParam = {
  quizId: string;
  screenId: string;
  serviceId: string;
};

const quizPageKey = ({ quizId, screenId, serviceId }: QuizPageParam) =>
  `services.${serviceId}.${quizId}.${screenId}.page`;

export const quizPageFamily = atomFamily(
  (param: QuizPageParam) =>
    atomWithMmkvStorage(quizPageKey(param), 0, z.number()),
  isEqual
);

export const useQuizPageAtom = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  return quizPageFamily({ quizId, screenId, serviceId });
};

export function resetAllQuizPages() {
  console.debug('Clearing ALL quiz pages');

  const exp = /^services\.([^.]+)\.([^.]+)\.(.+)\.page$/;
  for (const [serviceId, quizId, screenId] of clearMMKVKeys<
    [string, string, string]
  >(exp)) {
    quizPageFamily.remove({ quizId, screenId, serviceId });
  }
}

export function resetQuizPage({
  quizId,
  serviceId,
}: {
  quizId: string;
  serviceId: string;
}) {
  console.debug(`Clearing quiz pages for ${serviceId}.${quizId}`);

  const exp = new RegExp(`^services\\.${serviceId}\\.${quizId}\\.(.+)\\.page$`);
  for (const [screenId] of clearMMKVKeys<[string]>(exp)) {
    quizPageFamily.remove({ quizId, screenId, serviceId });
  }
}

export const useResetQuizPage = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizPage({ quizId, serviceId });
};
