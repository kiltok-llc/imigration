import { ComponentProps } from 'react';

import { FormRadioItem } from '@/components/form/radio';
import { useQuizFieldKey } from '@/components/quiz/hooks';
import { toI18nKey } from '@/lib/utils';

export function QuizRadioItem<T>({
                                   value,
                                   ...props
                                 }: Omit<ComponentProps<typeof FormRadioItem<T>>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey(`options.${toI18nKey(String(value))}`);

  return <FormRadioItem i18nKey={i18nKey} value={value} {...props} />;
}
