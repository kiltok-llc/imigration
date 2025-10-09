import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function FearOfTorture() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='fear-of-torture' />
    </QuizScreen>
  );
}
