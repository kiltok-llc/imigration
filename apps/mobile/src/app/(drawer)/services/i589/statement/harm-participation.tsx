import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function HarmParticipation() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='harm-participation' />
    </QuizScreen>
  );
}
