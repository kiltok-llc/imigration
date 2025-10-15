import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function CriminalHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='criminal-history' />
    </QuizScreen>
  );
}
