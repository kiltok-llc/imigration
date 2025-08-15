import { ComponentProps } from 'react';

import { useFormField } from '@/components/form/field';
import { FormLabel } from '@/components/form/label';
import { useQuizPageId } from '@/components/quiz/screen';
import { Trans } from '@/components/trans';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizFieldTitle({
  ...props
}: Omit<ComponentProps<typeof QuizTitle>, 'name'>) {
  const {
    field: { name },
  } = useFormField();

  return <QuizTitle {...props} name={toI18nKey(name)} />;
}

export function QuizPageTitle({
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'children'>) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();

  return (
    <FormLabel {...props}>
      <Trans
        i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.title`}
      />
    </FormLabel>
  );
}

export function QuizTitle({
  name,
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'children'> & {
  name: string;
}) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();

  return (
    <FormLabel {...props}>
      <Trans
        i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.${name}.title`}
      />
    </FormLabel>
  );
}
