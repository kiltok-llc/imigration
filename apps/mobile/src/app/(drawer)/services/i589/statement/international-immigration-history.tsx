import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function InternationalImmigrationHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='international-immigration-history' />
    </QuizScreen>
  );
}
