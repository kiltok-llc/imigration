import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function FearOfReturn() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='fear-of-return' />
    </QuizScreen>
  );
}
