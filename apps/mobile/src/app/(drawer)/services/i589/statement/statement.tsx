import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function Statement() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='statement' />
    </QuizScreen>
  );
}
