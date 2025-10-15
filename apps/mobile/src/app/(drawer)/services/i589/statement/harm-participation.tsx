import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function HarmParticipation() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='harm-participation' />
    </QuizScreen>
  );
}
