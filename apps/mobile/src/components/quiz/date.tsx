import { ComponentProps } from 'react';

import { FormDateInput } from '@/components/form/date';
import { useFormField } from '@/components/form/field';
import { useQuizPageId } from '@/components/quiz/screen';
import { Trans } from '@/components/trans';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizDateInput({
  ...props
}: Omit<ComponentProps<typeof FormDateInput>, 'label'>) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name },
  } = useFormField();

  return (
    <FormDateInput
      label={
        <Trans
          i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.${toI18nKey(name)}.label`}
        />
      }
      {...props}
    />
  );
}
