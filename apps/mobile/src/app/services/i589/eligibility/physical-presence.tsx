import {useLocalSearchParams, useRouter } from 'expo-router';
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
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';
import { useRouteSequenceNavigation } from '@/providers/route-sequence';


export default function PhysicalPresence() {
  const { t } = useTranslation();
  const [nextRoute, prevRoute] = useRouteSequenceNavigation();
  const [isInUsa, setIsInUsa] = useAtom(quizAnswerFamily('isInUsa'));

  const handleContinue = () => {
    if (isInUsa === undefined) {
      toast.error(t('quiz.missing'));
      return;
    }

    nextRoute();
  };

  return (
    <QuizLayout>
      <QuizContents>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.physical-presence.is-in-usa" />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setIsInUsa} value={isInUsa} />
      </QuizContents>
      <QuizActions>
        <QuizSecondaryActionButton onPress={prevRoute}>
          <Trans i18nKey="quiz.back" />
        </QuizSecondaryActionButton>
        <QuizPrimaryActionButton onPress={handleContinue}>
          <Trans i18nKey="quiz.continue" />
        </QuizPrimaryActionButton>
      </QuizActions>
    </QuizLayout>
  );
}

