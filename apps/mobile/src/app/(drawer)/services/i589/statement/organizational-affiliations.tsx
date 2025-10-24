import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function OrganizationalAffiliations() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='organizational-affiliations'>
        <QuizChat chips={[]} prompt='' />
      </QuizPage>
    </QuizScreen>
  );
}
