import { useAtom } from 'jotai';

import { Trans } from '@/components/trans';
import { EligibilityQuiz, EligibilityQuizPage } from '@/components/ui/eligibility';
import { QuizPrimaryQuestionText, QuizYesNoInput } from '@/components/ui/quiz';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';


export default function PhysicalPresence() {
  const [isInUsa, setIsInUsa] = useAtom(quizAnswerFamily('isInUsa'));

  return (
    <EligibilityQuiz>
      <EligibilityQuizPage onSubmit={() => {
        switch (isInUsa) {
          case false: {
            return 'INELIGIBLE';
          }
          case true: {
            return 'NEXT';
          }
          case undefined: {
            return 'MISSING';
          }
        }
      }}>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.physical-presence.is-in-usa" />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setIsInUsa} value={isInUsa} />
      </EligibilityQuizPage>
    </EligibilityQuiz>
  );
}

