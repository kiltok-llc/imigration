import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function InternationalImmigrationHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='international-immigration-history'>
        <QuizChat chips={[]} prompt='' />
      </QuizPage>
    </QuizScreen>
  );
}
