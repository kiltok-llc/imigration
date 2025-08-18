import { useFormField } from '@/components/form/field';
import { useQuizPageId } from '@/components/quiz/screen';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export const useQuizFieldKey = (id: null | string, name?: string) => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name: fieldName },
  } = useFormField();

  const key = `services.${serviceId}.${quizId}.${screenId}.${pageId}.${name ?? toI18nKey(fieldName)}`;

  if (id === null) {
    return key;
  }

  return `${key}.${toI18nKey(id)}`;
};

export const useQuizPageKey = (id: null | string) => {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();

  const key = `services.${serviceId}.${quizId}.${screenId}.${pageId}`;

  if (id === null) {
    return key;
  }

  return `${key}.${id}`;
};
