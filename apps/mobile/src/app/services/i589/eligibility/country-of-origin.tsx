import { useAtom } from 'jotai';

import { Trans } from '@/components/trans';
import {
  EligibilityQuiz,
  EligibilityQuizPage,
} from '@/components/ui/eligibility';
import { QuizPrimaryQuestionText, QuizYesNoInput } from '@/components/ui/quiz';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';

export default function CountryOfOrigin() {
  const [isFromSafeCountry, setIsFromSafeCountry] = useAtom(
    quizAnswerFamily('isFromSafeCountry')
  );

  return (
    <EligibilityQuiz>
      <EligibilityQuizPage
        onSubmit={() => {
          switch (isFromSafeCountry) {
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
          <Trans i18nKey='services.i589.eligibility.country-of-origin.is-from-safe-country' />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput
          onChange={setIsFromSafeCountry}
          value={isFromSafeCountry}
        />
      </EligibilityQuizPage>
    </EligibilityQuiz>
  );
}
