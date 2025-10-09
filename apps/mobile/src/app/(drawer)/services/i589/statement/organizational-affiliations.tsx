import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';

export default function OrganizationalAffiliations() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='organizational-affiliations' />
    </QuizScreen>
  );
}
