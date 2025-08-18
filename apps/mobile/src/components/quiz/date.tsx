import { ComponentProps } from 'react';

import { FormDateInput } from '@/components/form/date';
import { useQuizFieldKey } from '@/components/quiz/hooks';

export function QuizDateInput({
  ...props
}: Omit<ComponentProps<typeof FormDateInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return <FormDateInput i18nKey={i18nKey} {...props} />;
}
