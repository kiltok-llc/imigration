import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function FearOfReturn() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='fear-of-return' />
    </QuizScreen>
  );
}
