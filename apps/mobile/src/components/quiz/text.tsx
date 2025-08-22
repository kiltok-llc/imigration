import { ComponentProps } from 'react';
import tw from 'twrnc';

import { FormTextInput } from '@/components/form/text';
import { useQuizFieldKey } from '@/components/quiz/hooks';

export function QuizLongTextInput({
                                    ...props
                                  }: Omit<ComponentProps<typeof FormTextInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return (
    <FormTextInput
      i18nKey={i18nKey}
      multiline={true}
      scrollEnabled={false}
      style={tw`min-h-60`}
      {...props}
    />
  );
}

export function QuizTextInput({
                                ...props
                              }: Omit<ComponentProps<typeof FormTextInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return (
    <FormTextInput
      i18nKey={i18nKey}
      scrollEnabled={false}
      {...props}
    />
  );
}