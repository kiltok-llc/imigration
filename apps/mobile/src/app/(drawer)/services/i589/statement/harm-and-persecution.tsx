import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function HarmAndPersecution() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='harm-and-persecution' />
    </QuizScreen>
  );
}
