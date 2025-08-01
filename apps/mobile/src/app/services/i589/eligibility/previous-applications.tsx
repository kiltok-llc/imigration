import { useAtom } from 'jotai';

import { Trans } from '@/components/trans';
import {
  EligibilityQuiz,
  EligibilityQuizPage,
} from '@/components/ui/eligibility';
import { QuizPrimaryQuestionText, QuizYesNoInput } from '@/components/ui/quiz';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';

export default function PreviousApplications() {
  const [hasPreviousApp, setHasPreviousApp] = useAtom(
    quizAnswerFamily('hasPreviousApp')
  );

  return (
    <EligibilityQuiz>
      <EligibilityQuizPage
        onSubmit={() => {
          switch (hasPreviousApp) {
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
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.previous-applications.has-previous-app' />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setHasPreviousApp} value={hasPreviousApp} />
      </EligibilityQuizPage>
    </EligibilityQuiz>
  );
}
