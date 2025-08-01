import { useAtom } from 'jotai';

import { Trans } from '@/components/trans';
import {
  EligibilityQuiz,
  EligibilityQuizPage,
} from '@/components/ui/eligibility';
import { QuizPrimaryQuestionText, QuizYesNoInput } from '@/components/ui/quiz';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';

export default function ArrivalDate() {
  const [arrived, setArrived] = useAtom(quizAnswerFamily('isRecentArrival'));

  return (
    <EligibilityQuiz>
      <EligibilityQuizPage
        onSubmit={() => {
          switch (arrived) {
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
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.arrival-date.is-recent' />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setArrived} value={arrived} />
      </EligibilityQuizPage>
    </EligibilityQuiz>
  );
}
