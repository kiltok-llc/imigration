import {useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';

import { Trans } from '@/components/trans';
import {
  QuizActions,
  QuizContents,
  QuizLayout,
  QuizPrimaryActionButton,
  QuizPrimaryQuestionText,
  QuizSecondaryActionButton,
  QuizYesNoInput,
} from '@/components/ui/quiz';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';
import { useRouteSequenceNavigation } from '@/providers/route-sequence';

export default function ArrivalDate() {
  const [nextRoute, prevRoute] = useRouteSequenceNavigation();
  const [arrived, setArrived] = useAtom(quizAnswerFamily('isRecentArrival'));

  return (
    <QuizLayout>
      <QuizContents>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.physical-presence.is-recent" />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setArrived} value={arrived} />
      </QuizContents>
      <QuizActions>
        <QuizSecondaryActionButton onPress={prevRoute}>
          <Trans i18nKey="quiz.back" />
        </QuizSecondaryActionButton>
        <QuizPrimaryActionButton onPress={nextRoute}>
          <Trans i18nKey="quiz.continue" />
        </QuizPrimaryActionButton>
      </QuizActions>
    </QuizLayout>
  );
}

