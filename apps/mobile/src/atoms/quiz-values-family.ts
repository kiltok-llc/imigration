import { isEqual } from '@ver0/deep-equal';
import { useGlobalSearchParams } from 'expo-router';
import { PrimitiveAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { FieldValues } from 'react-hook-form';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { clearMMKVKeys } from '@/lib/utils';

type QuizValuesParam = {
  pageId: string;
  params: Record<string, string>;
  quizId: string;
  screenId: string;
  serviceId: string;
};

const quizValuesKey = ({
  pageId,
  params,
  quizId,
  screenId,
  serviceId,
}: QuizValuesParam) =>
  `services.${serviceId}.${quizId}.${screenId}.${pageId}.${JSON.stringify(params)}.values`;

export const quizValuesFamily = atomFamily(
  (param: QuizValuesParam) =>
    atomWithMmkvStorage<FieldValues>(quizValuesKey(param), {}),
  isEqual
);

export const useQuizValuesAtom = <T>(pageId: string) => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const params = useGlobalSearchParams<Record<string, string>>();

  return quizValuesFamily({
    pageId,
    params,
    quizId,
    screenId,
    serviceId,
  }) as PrimitiveAtom<T>;
};

export function resetAllQuizValues() {
  console.log('Clearing ALL quiz values');
  const exp = /^services\.([^.]+)\.([^.]+)\.(.+)\.([^.]+)\.([^.]+)\.values$/;
  for (const [serviceId, quizId, screenId, pageId, params] of clearMMKVKeys<
    [string, string, string, string, string]
  >(exp)) {
    quizValuesFamily.remove({
      pageId,
      params: JSON.parse(params),
      quizId,
      screenId,
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
    `^services\\.${serviceId}\\.${quizId}\\.(.+)\\.([^.]+)\\.([^.]+)\\.values$`
  );
  for (const [screenId, pageId, params] of clearMMKVKeys<
    [string, string, string]
  >(exp)) {
    quizValuesFamily.remove({
      pageId,
      params: JSON.parse(params),
      quizId,
      screenId,
      serviceId,
    });
  }
}

export const useResetQuizValues = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizValues({ quizId, serviceId });
};
