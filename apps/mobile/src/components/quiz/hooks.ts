import { useFormField } from '@/components/form/field';
import { useQuizPageId } from '@/components/quiz/page';
import { useScreen } from '@/hooks/use-screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { toI18nKey } from '@/lib/utils';

export const useQuizFieldKey = (id: null | string, name?: string) => {
  const service = useService();
  const step = useStep();
  const screenId = useScreen();
  const pageId = useQuizPageId();
  const {
    field: { name: fieldName },
  } = useFormField();

  const key = `services.${service}.${step}.${screenId}.${pageId}.${name ?? toI18nKey(fieldName)}`;

  if (id === null) {
    return key;
  }

  return `${key}.${toI18nKey(id)}`;
};

export const useQuizPageKey = (id: null | string) => {
  const service = useService();
  const step = useStep();
  const screenId = useScreen();
  const pageId = useQuizPageId();

  const key = `services.${service}.${step}.${screenId}.${pageId}`;

  if (id === null) {
    return key;
  }

  return `${key}.${id}`;
};
