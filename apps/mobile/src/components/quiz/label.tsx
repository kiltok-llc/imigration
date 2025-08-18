import { ComponentProps } from 'react';
import tw from 'twrnc';

import { FormLabel } from '@/components/form/label';
import { useQuizFieldKey, useQuizPageKey } from '@/components/quiz/hooks';

export function QuizFieldTitle({
                                 name,
                                 style,
                                 ...props
                               }: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'> & {
  name?: string;
}) {
  const i18nKey = useQuizFieldKey('title', name);

  return (
    <FormLabel
      i18nKey={i18nKey}
      style={[tw`mx-4 text-center font-semibold`, style]}
      variant="headlineSmall"
      {...props}
    />
  );
}

export function QuizPageDescription(
  {
    ...props
  }: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'>) {
  const i18nKey = useQuizPageKey('description');

  return <FormLabel i18nKey={i18nKey} {...props} variant="titleMedium" />;
}

export function QuizPageTitle({
                                style,
                                ...props
                              }: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'>) {

  const i18nKey = useQuizPageKey('title');

  return (
    <FormLabel
      i18nKey={i18nKey}
      style={[tw`text-center font-semibold`, style]}
      variant="headlineSmall"
      {...props}
    />
  );
}
