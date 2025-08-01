import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import z from 'zod/v4';

import { atomWithValidation } from '@/atom/atom-with-validation';
import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { EligibilityQuiz, EligibilityQuizPage } from '@/components/ui/eligibility';
import { QuizCheckbox, QuizCheckboxGroup, QuizPrimaryQuestionText, QuizYesNoInput } from '@/components/ui/quiz';
import { HarmReasonEnum, quizAnswerFamily } from '@/lib/services/i589/eligibility';

const customHarmReasonValidationAtom = atomWithValidation(
  quizAnswerFamily('customHarmReason'),
  z.string().min(2),
);

export default function ReasonForLeaving() {
  const { t } = useTranslation();
  const [isEscapingHarm, setIsEscapingHarm] = useAtom(quizAnswerFamily('isEscapingHarm'));
  const [isHarmedByGov, setIsHarmedByGov] = useAtom(quizAnswerFamily('isHarmedByGov'));
  const [harmReasons, setHarmReasons] = useAtom(quizAnswerFamily('harmReasons'));
  const [customHarmReason, setCustomHarmReason] = useAtom(quizAnswerFamily('customHarmReason'));
  const {
    error: customHarmReasonError,
    isDirty: isCustomHarmReasonDirty,
  } = useAtomValue(customHarmReasonValidationAtom);
  const validateCustomHarmReason = useSetAtom(customHarmReasonValidationAtom);

  return (
    <EligibilityQuiz>
      <EligibilityQuizPage onSubmit={() => {
        switch (isEscapingHarm) {
          case false: {
            console.log('isEscapingHarm was false');
            return 'INELIGIBLE';
          }
          case true: {
            return 'NEXT';
          }
          case undefined: {
            console.log('isEscapingHarm was unanswered');
            return 'MISSING';
          }
        }
      }}>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.reason-for-leaving.is-escaping-harm" />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setIsEscapingHarm} value={isEscapingHarm} />
      </EligibilityQuizPage>

      <EligibilityQuizPage onSubmit={() => {
        if (harmReasons.length === 0) {
          console.log('harmReasons was unanswered');
          return 'MISSING';
        } else if (harmReasons.includes('none')) {
          console.log('no harmReasons selected');
          return 'INELIGIBLE';
        } else if (harmReasons.includes('other') && !validateCustomHarmReason()) {
          console.log('customHarmReason was invalid');
          return 'MISSING';
        }

        return 'NEXT';
      }}>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.reason-for-leaving.harm-reasons" />
        </QuizPrimaryQuestionText>
        <QuizCheckboxGroup onChange={setHarmReasons} value={harmReasons}>
          {HarmReasonEnum.options.map((reason) => (
            <QuizCheckbox
              exclusive={reason === 'none'}
              key={reason}
              label={t(`services.i589.eligibility.reason-for-leaving.reasons.${reason}`)}
              value={reason}
            />
          ))}
        </QuizCheckboxGroup>
        <FadeView visible={harmReasons.includes('other')}>
          <TextInput
            error={!!customHarmReasonError && !isCustomHarmReasonDirty}
            label={t('services.i589.eligibility.reason-for-leaving.other')}
            multiline={true}
            onChangeText={setCustomHarmReason}
            value={customHarmReason}
          />
        </FadeView>
      </EligibilityQuizPage>

      <EligibilityQuizPage onSubmit={() => {
        switch (isHarmedByGov) {
          case false: {
            console.log('isHarmedByGov was false');
            return 'INELIGIBLE';
          }
          case true: {
            return 'NEXT';
          }
          case undefined: {
            console.log('isHarmedByGov was unanswered');
            return 'MISSING';
          }
        }
      }}>
        <QuizPrimaryQuestionText>
          <Trans i18nKey="services.i589.eligibility.reason-for-leaving.is-harmed-by-gov" />
        </QuizPrimaryQuestionText>
        <QuizYesNoInput onChange={setIsHarmedByGov} value={isHarmedByGov} />
      </EligibilityQuizPage>
    </EligibilityQuiz>
  );
}

