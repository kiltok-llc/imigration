import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function InternationalImmigrationHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='international-immigration-history' />
    </QuizScreen>
  );
}
