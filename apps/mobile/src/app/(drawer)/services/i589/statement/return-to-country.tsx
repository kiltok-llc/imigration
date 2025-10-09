import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function ReturnToCountry() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='return-to-country' />
    </QuizScreen>
  );
}
