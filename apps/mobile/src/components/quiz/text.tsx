import { ComponentProps } from 'react';

import { FormTextInput } from '@/components/form/text';
import { useQuizFieldKey } from '@/components/quiz/hooks';

export function QuizTextInput({
  ...props
}: Omit<ComponentProps<typeof FormTextInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return <FormTextInput i18nKey={i18nKey} {...props} />;
}
