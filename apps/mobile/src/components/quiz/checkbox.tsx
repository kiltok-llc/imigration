import { ComponentProps } from 'react';

import { FormCheckboxItem, FormConfirmBox } from '@/components/form/checkbox';
import { useQuizFieldKey } from '@/components/quiz/hooks';
import { toI18nKey } from '@/lib/utils';

export function QuizCheckboxItem<T>({
  value,
  ...props
}: Omit<ComponentProps<typeof FormCheckboxItem<T>>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey(`options.${toI18nKey(String(value))}`);

  return <FormCheckboxItem i18nKey={i18nKey} value={value} {...props} />;
}

export function QuizConfirmBox({
  ...props
}: Omit<ComponentProps<typeof FormConfirmBox>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return <FormConfirmBox i18nKey={i18nKey} {...props} />;
}
