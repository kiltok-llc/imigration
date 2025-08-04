import { useRouter } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';
import z from 'zod/v4';

import { atomWithValidation } from '@/atoms/atom-with-validation';
import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { Checkbox, CheckboxGroup } from '@/components/ui/checkbox';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { QuizPrimaryQuestionText } from '@/components/ui/quiz/ui';
import { BooleanRadioGroup } from '@/components/ui/radio';
import { answerFamily, HarmReasonEnum } from '@/lib/services/i589/eligibility';

const customHarmReasonValidationAtom = atomWithValidation(
  answerFamily('customHarmReason'),
  z.string().min(2)
);

export default function ReasonForLeaving() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isEscapingHarm, setIsEscapingHarm] = useAtom(
    answerFamily('isEscapingHarm')
  );
  const [isHarmedByGov, setIsHarmedByGov] = useAtom(
    answerFamily('isHarmedByGov')
  );
  const [harmReasons, setHarmReasons] = useAtom(answerFamily('harmReasons'));
  const [customHarmReason, setCustomHarmReason] = useAtom(
    answerFamily('customHarmReason')
  );
  const { error: customHarmReasonError, isDirty: isCustomHarmReasonDirty } =
    useAtomValue(customHarmReasonValidationAtom);
  const validateCustomHarmReason = useSetAtom(customHarmReasonValidationAtom);

  return (
    <Quiz>
      <QuizPage
        onSubmit={() => {
          if (isEscapingHarm === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (!isEscapingHarm) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.reason-for-leaving.is-escaping-harm' />
        </QuizPrimaryQuestionText>
        <BooleanRadioGroup
          onChange={setIsEscapingHarm}
          value={isEscapingHarm}
        />
      </QuizPage>

      <QuizPage
        onSubmit={() => {
          if (harmReasons.length === 0) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (harmReasons.includes('none')) {
            router.replace('../ineligible');
            return false;
          }

          if (harmReasons.includes('other') && !validateCustomHarmReason()) {
            toast.error(t('quiz.missing'));
            return false;
          }

          return true;
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.reason-for-leaving.harm-reasons' />
        </QuizPrimaryQuestionText>
        <CheckboxGroup onChange={setHarmReasons} value={harmReasons}>
          {HarmReasonEnum.options.map((reason) => (
            <Checkbox
              exclusive={reason === 'none'}
              key={reason}
              label={t(
                `services.i589.eligibility.reason-for-leaving.reasons.${reason}`
              )}
              value={reason}
            />
          ))}
        </CheckboxGroup>
        <FadeView visible={harmReasons.includes('other')}>
          <TextInput
            error={!!customHarmReasonError && !isCustomHarmReasonDirty}
            label={t('services.i589.eligibility.reason-for-leaving.other')}
            multiline={true}
            onChangeText={setCustomHarmReason}
            value={customHarmReason}
          />
        </FadeView>
      </QuizPage>

      <QuizPage
        onSubmit={() => {
          if (isHarmedByGov === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (!isHarmedByGov) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.reason-for-leaving.is-harmed-by-gov' />
        </QuizPrimaryQuestionText>
        <BooleanRadioGroup onChange={setIsHarmedByGov} value={isHarmedByGov} />
      </QuizPage>
    </Quiz>
  );
}
