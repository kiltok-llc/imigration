import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { FormCheckboxItem, FormConfirmBox } from '@/components/form/checkbox';
import { useFormField } from '@/components/form/field';
import { useQuizPageId } from '@/components/quiz/screen';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizCheckboxItem<T>({
  value,
  ...props
}: Omit<ComponentProps<typeof FormCheckboxItem<T>>, 'label'>) {
  const { t } = useTranslation();
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name },
  } = useFormField();

  return (
    <FormCheckboxItem
      label={t(
        `services.${serviceId}.${quizId}.${screenId}.${pageId}.${toI18nKey(name)}.options.${toI18nKey(String(value))}`
      )}
      value={value}
      {...props}
    />
  );
}

export function QuizConfirmBox({
  ...props
}: Omit<ComponentProps<typeof FormConfirmBox>, 'label'>) {
  const { t } = useTranslation();
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name },
  } = useFormField();

  return (
    <FormConfirmBox
      label={t(
        `services.${serviceId}.${quizId}.${screenId}.${pageId}.${toI18nKey(name)}.label`
      )}
      {...props}
    />
  );
}
