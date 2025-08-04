import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';

export const quizRouteFamily = atomFamily(
  ({ quizId, serviceId }: { quizId: string; serviceId: string }) =>
    atomWithMmkvStorage(
      `services.${serviceId}.${quizId}.route`,
      '',
      z.string()
    ),
  (a, b) => a.quizId === b.quizId && a.serviceId === b.serviceId
);

export const useQuizRouteAtom = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return quizRouteFamily({ quizId, serviceId });
};
