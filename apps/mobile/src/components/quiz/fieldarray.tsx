import { ComponentProps } from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import {
  FormArrayAdd,
  useFormArray,
  useFormFieldArrayItem,
} from '@/components/form/fieldarray';
import { useQuizFieldKey } from '@/components/quiz/hooks';
import { QuizFieldTitle } from '@/components/quiz/label';

export function QuizFieldArrayAdd({
  ...props
}: Omit<ComponentProps<typeof FormArrayAdd>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('add');

  return <FormArrayAdd i18nKey={i18nKey} {...props} />;
}

export function QuizFieldArrayItemHeader({
  removeButton = true,
}: {
  removeButton: boolean;
}) {
  const theme = useTheme();
  const index = useFormFieldArrayItem();
  const { remove } = useFormArray();

  return (
    <View style={tw`flex-row items-center justify-between gap-2`}>
      <QuizFieldTitle style={tw`flex-1 text-left`} />
      {removeButton && (
        <IconButton
          containerColor={theme.colors.errorContainer}
          icon='close'
          iconColor={theme.colors.error}
          mode='contained'
          onPress={() => remove(index)}
        />
      )}
    </View>
  );
}
