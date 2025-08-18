import { ComponentProps } from 'react';

import { FormDropdown, FormMultiDropdown } from '@/components/form/dropdown';
import { useQuizFieldKey } from '@/components/quiz/hooks';

export function QuizDropdown({
  options,
  ...props
}: Omit<ComponentProps<typeof FormDropdown>, 'i18nKey' | 'options'> & {
  options: { i18nKey?: string; value: string }[];
}) {
  const rootKey = useQuizFieldKey(null);

  return (
    <FormDropdown
      i18nKey={`${rootKey}.label`}
      options={options.map(({ i18nKey, value }) => ({
        i18nKey: i18nKey ?? `${rootKey}.options.${value}`,
        value,
      }))}
      {...props}
    />
  );
}

export function QuizMultiDropdown({
  options,
  ...props
}: Omit<ComponentProps<typeof FormMultiDropdown>, 'i18nKey' | 'options'> & {
  options: { i18nKey?: string; value: string }[];
}) {
  const rootKey = useQuizFieldKey(null);

  return (
    <FormMultiDropdown
      i18nKey={`${rootKey}.label`}
      options={options.map(({ i18nKey, value }) => ({
        i18nKey: i18nKey ?? `${rootKey}.options.${value}`,
        value,
      }))}
      {...props}
    />
  );
}
