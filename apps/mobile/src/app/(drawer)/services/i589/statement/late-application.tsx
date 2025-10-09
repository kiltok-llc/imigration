import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function LateApplication() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='late-application' />
    </QuizScreen>
  );
}
