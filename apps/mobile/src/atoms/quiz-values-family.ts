import { atom, PrimitiveAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { FieldValues } from 'react-hook-form';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { storage } from '@/lib/mmkv';

export const quizValuesFamily = atomFamily(
  ({
    pageId,
    quizId,
    serviceId,
  }: {
    pageId: null | string;
    quizId: string;
    serviceId: string;
  }) =>
    atomWithMmkvStorage<FieldValues>(
      `services.${serviceId}.${quizId}.persisted-values.${pageId}`,
      {}
    ),
  (a, b) =>
    a.quizId === b.quizId &&
    a.serviceId === b.serviceId &&
    a.pageId === b.pageId
);

export const useQuizValuesAtom = <T>(pageId: null | string) => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  if (pageId === null) {
    return atom({} as T);
  }

  return quizValuesFamily({ pageId, quizId, serviceId }) as PrimitiveAtom<T>;
};

export function resetQuizValues({
  quizId,
  serviceId,
}: {
  quizId: string;
  serviceId: string;
}) {
  console.log(`Clearing persisted values for quiz ${serviceId}.${quizId}`);

  const prefix = `services.${serviceId}.${quizId}.persisted-values.`;
  const keys = storage.getAllKeys().filter((key) => key.startsWith(prefix));

  for (const key of keys) {
    storage.delete(key);
  }
}

export const useResetQuizValues = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizValues({ quizId, serviceId });
};
