import { ComponentProps } from 'react';

import { FormCheckboxItem, FormConfirmBox } from '@/components/form/checkbox';
import { toI18nKey, useQuizFieldLocaleKey } from '@/lib/quiz/locale';

export function QuizCheckboxItem<T>({
  value,
  ...props
}: Omit<ComponentProps<typeof FormCheckboxItem<T>>, 'i18nKey'>) {
  const i18nKey = useQuizFieldLocaleKey(`options.${toI18nKey(String(value))}`);

  return <FormCheckboxItem i18nKey={i18nKey} value={value} {...props} />;
}

export function QuizConfirmBox({
  ...props
}: Omit<ComponentProps<typeof FormConfirmBox>, 'i18nKey'>) {
  const i18nKey = useQuizFieldLocaleKey('label');

  return <FormConfirmBox i18nKey={i18nKey} {...props} />;
}
