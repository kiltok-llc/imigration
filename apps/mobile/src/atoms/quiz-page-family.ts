import { isEqual } from '@ver0/deep-equal';
import { useGlobalSearchParams } from 'expo-router';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { clearMMKVKeys } from '@/lib/utils';

type QuizPageParam = {
  params: Record<string, string>;
  quizId: string;
  screenId: string;
  serviceId: string;
};

const quizPageKey = ({ params, quizId, screenId, serviceId }: QuizPageParam) =>
  `services.${serviceId}.${quizId}.${screenId}.${JSON.stringify(params)}.page`;

export const quizPageFamily = atomFamily(
  (param: QuizPageParam) =>
    atomWithMmkvStorage(quizPageKey(param), 0, z.number()),
  isEqual
);

export const useQuizPageAtom = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const params = useGlobalSearchParams<Record<string, string>>();
  return quizPageFamily({ params, quizId, screenId, serviceId });
};

export function resetAllQuizPages() {
  console.log('Clearing ALL quiz pages');

  const exp = /^services\.([^.]+)\.([^.]+)\.(.+)\.([^.]+)\.page$/;
  for (const [serviceId, quizId, screenId, params] of clearMMKVKeys<
    [string, string, string, string]
  >(exp)) {
    quizPageFamily.remove({
      params: JSON.parse(params),
      quizId,
      screenId,
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

  const exp = new RegExp(
    `^services\\.${serviceId}\\.${quizId}\\.(.+)\\.([^.]+)\\.page$`
  );
  for (const [screenId, params] of clearMMKVKeys<[string, string]>(exp)) {
    quizPageFamily.remove({
      params: JSON.parse(params),
      quizId,
      screenId,
      serviceId,
    });
  }
}

export const useResetQuizPage = () => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  return () => resetQuizPage({ quizId, serviceId });
};
