import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function HarmParticipation() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='harm-participation'>
        <QuizChat chips={[]} prompt='' />
      </QuizPage>
    </QuizScreen>
  );
}
