import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { storage } from '@/lib/mmkv';

export const quizPageFamily = atomFamily(
  ({
    quizId,
    screenId,
    serviceId,
  }: {
    quizId: string;
    screenId: string;
    serviceId: string;
  }) =>
    atomWithMmkvStorage(
      `services.${serviceId}.${quizId}.${screenId}.page`,
      0,
      z.number()
    ),
  isEqual
);

export const useQuizPageAtom = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  return quizPageFamily({ quizId, screenId, serviceId });
};

export function resetQuizPages({
  quizId,
  serviceId,
}: {
  quizId: string;
  serviceId: string;
}) {
  console.debug(`Clearing quiz pages for ${serviceId}.${quizId}`);

  const exp = new RegExp(`^services\\.${serviceId}\\.${quizId}\\.(.+)\\.page$`);
  const matches = storage
    .getAllKeys()
    .map((key) => key.match(exp))
    .filter((m) => !!m);

  for (const [key, screenId] of matches) {
    if (!screenId) {
      console.warn(`Invalid quiz page match for key: ${key}`);
      continue;
    }

    console.debug(`Resetting quiz page for: ${screenId}`);
    storage.delete(key);
    quizPageFamily.remove({ quizId, screenId, serviceId });
  }

  console.debug(
    `${matches.length} quiz pages cleared for ${serviceId}.${quizId}`
  );
}

export const useResetQuizPages = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizPages({ quizId, serviceId });
};
