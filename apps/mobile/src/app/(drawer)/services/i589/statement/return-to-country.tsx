import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function ReturnToCountry() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='return-to-country' />
    </QuizScreen>
  );
}
