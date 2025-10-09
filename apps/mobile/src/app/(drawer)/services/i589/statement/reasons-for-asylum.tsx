import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function ReasonsForAsylum() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='reasons-for-asylum' />
    </QuizScreen>
  );
}
