import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function InternationalCriminalHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='international-criminal-history' />
    </QuizScreen>
  );
}
