import { useFormField } from '@/components/form/field';
import { useQuizPageId } from '@/components/quiz/page';
import { useScreenId } from '@/hooks/use-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export const useQuizFieldKey = (id: null | string, name?: string) => {
  const serviceId = useServiceId();
  const stepId = useStepId();
  const screenId = useScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name: fieldName },
  } = useFormField();

  const key = `services.${serviceId}.${stepId}.${screenId}.${pageId}.${name ?? toI18nKey(fieldName)}`;

  if (id === null) {
    return key;
  }

  return `${key}.${toI18nKey(id)}`;
};

export const useQuizPageKey = (id: null | string) => {
  const serviceId = useServiceId();
  const stepId = useStepId();
  const screenId = useScreenId();
  const pageId = useQuizPageId();

  const key = `services.${serviceId}.${stepId}.${screenId}.${pageId}`;

  if (id === null) {
    return key;
  }

  return `${key}.${id}`;
};
