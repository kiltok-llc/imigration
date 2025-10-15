import { Text } from 'react-native-paper';

import { QuizChatActionChip } from '@/lib/quiz/chat';

export const useInterviewControlChips = () => {
  return [
    {
      description:
        'This chip will end the interview when pressed. Show this chip when the interview might end soon or the user is out of information. YOU CANNOT END THE INTERVIEW YOURSELF, only the user must do it by pressing this chip.',
      id: 'end-interview',
      render: () => <Text>End Interview</Text>,
    },
  ] as QuizChatActionChip[];
};
