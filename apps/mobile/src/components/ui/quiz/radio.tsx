import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { useFormField } from '@/components/ui/form/field';
import { FormRadioItem } from '@/components/ui/form/radio';
import { useQuizPageId } from '@/components/ui/quiz/screen';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizRadioItem<T>({
                                   value,
                                   ...props
                                 }: Omit<ComponentProps<typeof FormRadioItem<T>>, 'label'>) {
  const { t } = useTranslation();
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name },
  } = useFormField();

  return (
    <FormRadioItem
      label={t(
        `services.${serviceId}.${quizId}.${screenId}.${pageId}.${toI18nKey(name)}.options.${toI18nKey(String(value))}`,
      )}
      value={value}
      {...props}
    />
  );
}
