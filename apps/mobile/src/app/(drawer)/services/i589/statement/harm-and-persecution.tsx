import { QuizChat } from '@/components/quiz/chat';
import { QuizScreen } from '@/components/quiz/screen';

export default function HarmAndPersecution() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizChat pageId='harm-and-persecution' />
    </QuizScreen>
  );
}
