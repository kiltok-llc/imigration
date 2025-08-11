import { isEqual } from '@ver0/deep-equal';
import { PrimitiveAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { FieldValues } from 'react-hook-form';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { storage } from '@/lib/mmkv';

export const quizValuesFamily = atomFamily(
  ({
    pageId,
    quizId,
    screenId,
    serviceId,
  }: {
    pageId: string;
    quizId: string;
    screenId: string;
    serviceId: string;
  }) =>
    atomWithMmkvStorage<FieldValues>(
      `services.${serviceId}.${quizId}.${screenId}.${pageId}.values`,
      {}
    ),
  isEqual
);

export const useQuizValuesAtom = <T>(pageId: string) => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();

  return quizValuesFamily({
    pageId,
    quizId,
    screenId,
    serviceId,
  }) as PrimitiveAtom<T>;
};

export function resetQuizValues({
  quizId,
  serviceId,
}: {
  quizId: string;
  serviceId: string;
}) {
  console.debug(`Clearing quiz values for ${serviceId}.${quizId}`);

  const exp = new RegExp(
    `^services\\.${serviceId}\\.${quizId}\\.(.+)\\.([^.]+)\\.values$`
  );
  const matches = storage
    .getAllKeys()
    .map((key) => key.match(exp))
    .filter((m) => !!m);

  console.log(storage.getAllKeys());

  for (const [key, screenId, pageId] of matches) {
    if (!screenId || !pageId) {
      console.warn(`Invalid quiz value match for key: ${key}`);
      continue;
    }

    console.debug(`Reset values: ${screenId}.${pageId}`);
    storage.delete(key);
    quizValuesFamily.remove({ pageId, quizId, screenId, serviceId });
  }

  console.debug(
    `${matches.length} quiz values cleared for ${serviceId}.${quizId}`
  );
}

export const useResetQuizValues = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizValues({ quizId, serviceId });
};
