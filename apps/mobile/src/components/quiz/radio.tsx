import { ComponentProps } from 'react';

import { FormRadioItem } from '@/components/form/radio';
import { toI18nKey, useQuizFieldLocaleKey } from '@/lib/quiz/locale';

export function QuizRadioItem<T>({
  value,
  ...props
}: Omit<ComponentProps<typeof FormRadioItem<T>>, 'i18nKey'>) {
  const i18nKey = useQuizFieldLocaleKey(`options.${toI18nKey(String(value))}`);

  return <FormRadioItem i18nKey={i18nKey} value={value} {...props} />;
}
