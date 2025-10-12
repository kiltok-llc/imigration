import { QuizChatPage } from '@/components/quiz/chat-page';
import { QuizScreen } from '@/components/quiz/screen';
import {
  useLateApplicationFactsPrompt,
  useLateApplicationPrompt,
} from '@/lib/lm/i589';
import { useLanguagePrompt } from '@/lib/lm/language';

export default function LateApplication() {
  const languagePrompt = useLanguagePrompt();
  const lateApplicationPrompt = useLateApplicationPrompt();
  const factsPrompt = useLateApplicationFactsPrompt();
  const prompt = [lateApplicationPrompt, factsPrompt, languagePrompt].join(
    '\n\n'
  );

  return (
    <QuizScreen migriFAB={false}>
      <QuizChatPage pageId='late-application' prompt={prompt} />
    </QuizScreen>
  );
}
