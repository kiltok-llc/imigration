import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { quizStorage } from '@/lib/mmkv';

type QuizRouteParam = {
  quizId: string;
  serviceId: string;
};

const quizRouteKey = ({ quizId, serviceId }: QuizRouteParam) =>
  `services:${serviceId}:${quizId}:route`;

export const quizRouteFamily = atomFamily(
  (param: QuizRouteParam) =>
    atomWithMmkvStorage(
      quizRouteKey(param),
      null,
      z.string().nullable(),
      quizStorage
    ),
  isEqual
);

export const useQuizRouteAtom = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return quizRouteFamily({ quizId, serviceId });
};
