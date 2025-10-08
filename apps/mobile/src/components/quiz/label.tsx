import { ComponentProps } from 'react';
import tw from 'twrnc';

import { FormLabel } from '@/components/form/label';
import { useQuizFieldLocaleKey, useQuizPageLocaleKey } from '@/lib/quiz/locale';

export function QuizFieldDescription({
  name,
  style,
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'> & {
  name?: string;
}) {
  const i18nKey = useQuizFieldLocaleKey('description', name);

  return <FormLabel i18nKey={i18nKey} {...props} variant='titleMedium' />;
}

export function QuizFieldTip({
  name,
  style,
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'> & {
  name?: string;
}) {
  const i18nKey = useQuizFieldLocaleKey('tip', name);

  return (
    <FormLabel
      i18nKey={i18nKey}
      style={[tw`text-center`, style]}
      variant='bodyMedium'
      {...props}
    />
  );
}

export function QuizFieldTitle({
  name,
  style,
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'> & {
  name?: string;
}) {
  const i18nKey = useQuizFieldLocaleKey('title', name);

  return (
    <FormLabel
      i18nKey={i18nKey}
      style={[tw`mx-4 text-center font-semibold`, style]}
      variant='headlineSmall'
      {...props}
    />
  );
}

export function QuizPageDescription({
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'>) {
  const i18nKey = useQuizPageLocaleKey('description');

  return <FormLabel i18nKey={i18nKey} {...props} variant='titleMedium' />;
}

export function QuizPageTitle({
  style,
  ...props
}: Omit<ComponentProps<typeof FormLabel>, 'i18nKey'>) {
  const i18nKey = useQuizPageLocaleKey('title');

  return (
    <FormLabel
      i18nKey={i18nKey}
      style={[tw`text-center font-semibold`, style]}
      variant='headlineSmall'
      {...props}
    />
  );
}
