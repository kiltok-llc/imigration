import { ComponentProps } from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import {
  FormFieldArrayAdd,
  useFormFieldArray,
  useFormFieldArrayItem,
} from '@/components/form/fieldarray';
import { useQuizFieldKey } from '@/components/quiz/hooks';
import { QuizFieldTitle } from '@/components/quiz/label';

export function QuizFieldArrayAdd({
  ...props
}: Omit<ComponentProps<typeof FormFieldArrayAdd>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('add');

  return <FormFieldArrayAdd i18nKey={i18nKey} {...props} />;
}

export function QuizFieldArrayItemHeader() {
  const theme = useTheme();
  const index = useFormFieldArrayItem();
  const { remove } = useFormFieldArray();

  return (
    <View style={tw`flex-row items-center justify-between gap-2`}>
      <QuizFieldTitle style={tw`flex-1 text-left`} />
      <IconButton
        containerColor={theme.colors.errorContainer}
        icon='close'
        iconColor={theme.colors.error}
        mode='contained'
        onPress={() => remove(index)}
      />
    </View>
  );
}
