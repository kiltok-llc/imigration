import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function ReturnToCountry() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='return-to-country'>
        <QuizChat chips={[]} prompt='' />
      </QuizPage>
    </QuizScreen>
  );
}
