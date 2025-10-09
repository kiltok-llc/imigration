import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function InternationalCriminalHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='international-criminal-history' />
    </QuizScreen>
  );
}
