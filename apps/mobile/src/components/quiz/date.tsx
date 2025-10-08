import { ComponentProps } from 'react';

import { FormDateInput } from '@/components/form/date';
import { useQuizFieldLocaleKey } from '@/lib/quiz/locale';

export function QuizDateInput({
  ...props
}: Omit<ComponentProps<typeof FormDateInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldLocaleKey('label');

  return <FormDateInput i18nKey={i18nKey} {...props} />;
}
