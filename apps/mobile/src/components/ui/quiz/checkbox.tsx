import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { FormCheckboxItem } from '@/components/ui/form/checkbox';
import { useFormField } from '@/components/ui/form/field';
import { useQuizPageId } from '@/components/ui/quiz/screen';
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
