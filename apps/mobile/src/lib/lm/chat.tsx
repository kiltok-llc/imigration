import { ComponentProps } from 'react';
import { Trans } from 'react-i18next';
import { Chip } from 'react-native-paper';

import { useQuizActions } from '@/lib/quiz/actions';
import { QuizChatActionChip } from '@/lib/quiz/chat';

export const useInterviewControlChips = () => {
  const { handleContinue } = useQuizActions();

  return [
    {
      description:
        'This chip will open the document upload dialog when pressed. Show this chip when the user may have documents to upload which could help their case.',
      id: 'upload-documents',
      render: () => (
        <ChatChip
          i18nKey='chat.chips.upload-documents'
          icon='upload'
          onPress={() => {
            console.log('opening dialog');
          }}
        />
      ),
    },
    {
      description:
        'This chip will end the interview when pressed. Show this chip when the interview might end soon or the user is out of information. YOU CANNOT END THE INTERVIEW YOURSELF, only the user must do it by pressing this chip.',
      id: 'end-interview',
      render: () => (
        <ChatChip
          i18nKey='chat.chips.end-interview'
          icon='exit-run'
          onPress={handleContinue}
        />
      ),
    },
  ] as QuizChatActionChip[];
};

export function ChatChip({
  i18nKey,
  ...props
}: Omit<ComponentProps<typeof Chip>, 'children'> & { i18nKey: string }) {
  return (
    <Chip {...props}>
      <Trans i18nKey={i18nKey} />
    </Chip>
  );
}
