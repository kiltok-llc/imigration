import { ComponentProps } from 'react';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { FormLabel } from '@/components/form/label';
import { useQuizPageId } from '@/components/quiz/screen';
import { Trans } from '@/components/trans';
import { useQuizScreenId } from '@/hooks/use-quiz-screen-id';
import { useServiceId } from '@/hooks/use-service-id';
import { useStepId } from '@/hooks/use-step-id';
import { toI18nKey } from '@/lib/utils';

export function QuizFieldTitle({
  name,
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'children'> & {
  name?: string;
}) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();

  const {
    field: { name: fieldName },
  } = useFormField();

  return (
    <FormLabel
      {...props}
      style={tw`mx-4 text-center font-semibold`}
      variant='headlineSmall'
    >
      <Trans
        i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.${name ?? toI18nKey(fieldName)}.title`}
      />
    </FormLabel>
  );
}

export function QuizPageDescription({
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'children'>) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();

  return (
    <FormLabel {...props} variant='titleMedium'>
      <Trans
        i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.description`}
      />
    </FormLabel>
  );
}

export function QuizPageTitle({
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'children'>) {
  const serviceId = useServiceId();
  const quizId = useStepId();
  const screenId = useQuizScreenId();
  const pageId = useQuizPageId();

  return (
    <FormLabel
      {...props}
      style={tw`text-center font-semibold`}
      variant='headlineSmall'
    >
      <Trans
        i18nKey={`services.${serviceId}.${quizId}.${screenId}.${pageId}.title`}
      />
    </FormLabel>
  );
}
