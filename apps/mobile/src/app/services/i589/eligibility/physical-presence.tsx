import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { useTranslation } from 'react-i18next';
import { RadioButton } from 'react-native-paper';

import { Trans } from '@/components/trans';
import {
  QuizActions,
  QuizContents,
  QuizLayout,
  QuizPrimaryActionButton,
  QuizPrimaryQuestionText, QuizSecondaryActionButton, QuizYesNoInput,
} from '@/components/ui/quiz';
import { eligibilityQuizAnswersAtom } from '@/lib/services/i589/eligibility';
import { toBoolean } from '@/lib/utils';
import { useNextRouteName } from '@/providers/route-sequence';

const isPhysicallyPresentAtom = focusAtom(
  eligibilityQuizAnswersAtom,
  (answers) => answers.prop('physicallyInUS'),
);

export default function PhysicalPresence() {
  const { t } = useTranslation();
  const router = useRouter();
  const nextRouteName = useNextRouteName();
  const [isPhysicallyPresent, setIsPhysicallyPresent] = useAtom(isPhysicallyPresentAtom);

  return (
    <QuizLayout>
      <QuizContents>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.physical-presence.is-physically-present" />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setIsPhysicallyPresent} value={isPhysicallyPresent} />
      </QuizContents>
      <QuizActions>
        <QuizSecondaryActionButton onPress={() => router.back()}>
          <Trans i18nKey='quiz.back' />
        </QuizSecondaryActionButton>
        <QuizPrimaryActionButton onPress={() => router.push(`./${nextRouteName}`)}>
          <Trans i18nKey="quiz.continue" />
        </QuizPrimaryActionButton>
      </QuizActions>
    </QuizLayout>
  );
}

