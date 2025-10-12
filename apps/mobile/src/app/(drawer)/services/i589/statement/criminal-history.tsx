import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function CriminalHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='criminal-history' />
    </QuizScreen>
  );
}
