import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function OrganizationalAffiliations() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='organizational-affiliations' />
    </QuizScreen>
  );
}
