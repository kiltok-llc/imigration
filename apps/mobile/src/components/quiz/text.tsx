import { ComponentProps } from 'react';

import { useFormField } from '@/components/form/field';
import { FormTextInput } from '@/components/form/text';
import { useQuizPageId } from '@/components/quiz/screen';
import { Trans } from '@/components/trans';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizTextInput({
  ...props
}: Omit<ComponentProps<typeof FormTextInput>, 'label'>) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name },
  } = useFormField();

  return (
    <FormTextInput
      label={
        <Trans
          i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.${toI18nKey(name)}.label`}
        />
      }
      {...props}
    />
  );
}
