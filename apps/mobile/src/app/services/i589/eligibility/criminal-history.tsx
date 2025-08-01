import { useAtom } from 'jotai';

import { Trans } from '@/components/trans';
import { EligibilityQuiz, EligibilityQuizPage } from '@/components/ui/eligibility';
import { QuizPrimaryQuestionText, QuizYesNoInput } from '@/components/ui/quiz';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';

export default function CriminalHistory() {
  const [hasCriminalHistory, setHasCriminalHistory] = useAtom(quizAnswerFamily('hasCriminalHistory'));

  return (
    <EligibilityQuiz>
      <EligibilityQuizPage onSubmit={() => {
        switch (hasCriminalHistory) {
          case false: {
            return 'NEXT';
          }
          case true: {
            return 'INELIGIBLE';
          }
          case undefined: {
            return 'MISSING';
          }
        }
      }}>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.criminal-history.has-criminal-history"/>
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setHasCriminalHistory} value={hasCriminalHistory}/>
      </EligibilityQuizPage>
    </EligibilityQuiz>
  );
}

