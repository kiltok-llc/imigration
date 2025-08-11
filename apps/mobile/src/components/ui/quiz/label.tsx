import { ComponentProps } from 'react';

import { Trans } from '@/components/trans';
import { useFormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { useQuizPageId } from '@/components/ui/quiz/screen';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizLabel({
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'children'>) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();
  const {
    field: { name },
  } = useFormField();

  return (
    <FormLabel {...props}>
      <Trans
        i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.${toI18nKey(name || 'title')}`}
      />
    </FormLabel>
  );
}
