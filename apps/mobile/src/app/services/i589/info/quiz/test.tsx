import { Text } from 'react-native-paper';

import { Quiz, QuizPage } from '@/components/ui/quiz/screen';

export default function Test() {
  return (
    <Quiz>
      <QuizPage
        onSubmit={() => {
          return true;
        }}
      >
        <Text>hi</Text>
      </QuizPage>
    </Quiz>
  );
}
