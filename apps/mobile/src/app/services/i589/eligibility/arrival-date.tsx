import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

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
import { quizAnswersAtom } from '@/lib/services/i589/eligibility';
import { useRouteSequenceNavigation } from '@/providers/route-sequence';

const arrivedAtom = focusAtom(
  quizAnswersAtom,
  (answers) => answers.prop('arrivedWithinLastYear'),
);

export default function ArrivalDate() {
  const [nextRoute, prevRoute] = useRouteSequenceNavigation();
  const [arrived, setArrived] = useAtom(arrivedAtom);

  return (
    <QuizLayout>
      <QuizContents>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.physical-presence.is-physically-present" />
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

