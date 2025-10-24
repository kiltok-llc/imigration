import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function HarmAndPersecution() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='harm-and-persecution'>
        <QuizChat chips={[]} prompt='' />
      </QuizPage>
    </QuizScreen>
  );
}
