import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function InternationalCriminalHistory() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='international-criminal-history'>
        <QuizChat chips={[]} prompt='' />
      </QuizPage>
    </QuizScreen>
  );
}
