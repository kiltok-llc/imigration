import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Text } from 'react-native-paper';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import {
  QuizActions, QuizCheckbox, QuizCheckboxGroup,
  QuizContents,
  QuizLayout,
  QuizPrimaryActionButton,
  QuizPrimaryQuestionText, QuizSecondaryActionButton,
  QuizYesNoInput,
} from '@/components/ui/quiz';
import { eligibilityQuizAnswersAtom, HARM_REASONS } from '@/lib/services/i589/eligibility';
import { useNextRouteName } from '@/providers/route-sequence';

const leftBecauseOfHarmAtom = focusAtom(
  eligibilityQuizAnswersAtom,
  (answers) => answers.prop('leftBecauseOfHarm'),
);

const harmCausedByGovernmentAtom = focusAtom(
  eligibilityQuizAnswersAtom,
  (answers) => answers.prop('harmCausedByGovernment'),
);

const harmReasonsAtom = focusAtom(
  eligibilityQuizAnswersAtom,
  (answers) => answers.prop('harmReasons'),
);

const harmReasonOtherAtom = focusAtom(
  eligibilityQuizAnswersAtom,
  (answers) => answers.prop('harmReasonOther'),
);

export default function ReasonForLeaving() {
  const router = useRouter();
  const { t } = useTranslation();
  const nextRouteName = useNextRouteName();
  const [leftBecauseOfHarm, setLeftBecauseOfHarm] = useAtom(leftBecauseOfHarmAtom);
  const [harmCausedByGovernment, setHarmCausedByGovernment] = useAtom(harmCausedByGovernmentAtom);
  const [harmReasons, setHarmReasons] = useAtom(harmReasonsAtom);
  const [harmReasonOther, setHarmReasonOther] = useAtom(harmReasonOtherAtom);
  const pagerViewRef = useRef<PagerView>(null);

  const currentPage = useMemo(() => {
    if (leftBecauseOfHarm !== true) {
      return 0;
    }

    return 1;
  }, [leftBecauseOfHarm])

  useEffect(() => {
    pagerViewRef.current?.setPage(currentPage);
  }, [currentPage]);

  return (
    <QuizLayout>
      <PagerView initialPage={currentPage} orientation="vertical" ref={pagerViewRef} scrollEnabled={false} style={tw`flex-1`}>
        <View key='0'>
          <QuizContents>
            <QuizPrimaryQuestionText>
              <Trans i18nKey="services.i589.eligibility.reason-for-leaving.left-because-of-harm" />
            </QuizPrimaryQuestionText>
            <QuizYesNoInput onChange={setLeftBecauseOfHarm} value={leftBecauseOfHarm} />
          </QuizContents>
        </View>
        <View key='1'>
          <QuizContents>
            <QuizPrimaryQuestionText>
              <Trans i18nKey="services.i589.eligibility.reason-for-leaving.harm-reasons" />
            </QuizPrimaryQuestionText>
            <QuizCheckboxGroup onChange={setHarmReasons} value={harmReasons}>
              {HARM_REASONS.map((reason) => (
                <QuizCheckbox key={reason} label={t(`services.i589.eligibility.reason-for-leaving.${reason}`)} value={reason} />
              ))}
            </QuizCheckboxGroup>
          </QuizContents>
        </View>
      </PagerView>
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

