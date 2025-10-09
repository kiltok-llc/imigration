import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function PreviousApplications() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='previous-applications' />
    </QuizScreen>
  );
}
