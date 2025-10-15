import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function PreviousApplications() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='previous-applications' />
    </QuizScreen>
  );
}
