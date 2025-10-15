import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function FearOfTorture() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='fear-of-torture' />
    </QuizScreen>
  );
}
