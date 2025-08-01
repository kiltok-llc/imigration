import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';
import z from 'zod/v4';

import { atomWithValidation } from '@/atom/atom-with-validation';
import { ReactivePagerView } from '@/components/reactive-pager-view';
import { Trans } from '@/components/trans';
import {
  QuizActions,
  QuizCheckbox,
  QuizCheckboxGroup,
  QuizContents,
  QuizLayout,
  QuizPrimaryActionButton,
  QuizPrimaryQuestionText,
  QuizSecondaryActionButton,
  QuizYesNoInput,
} from '@/components/ui/quiz';
import { HARM_REASONS, quizAnswerFamily } from '@/lib/services/i589/eligibility';
import { useRouteSequenceNavigation } from '@/providers/route-sequence';

const customHarmReasonValidationAtom = atomWithValidation(
  quizAnswerFamily('customHarmReason'),
  z.string().min(2),
);

export type PageResult = 'INELIGIBLE' | 'MISSING' | 'NEXT' | 'PREVIOUS';

export type QuizPage = () => PageResult;

const usePagedQuiz = (pages: QuizPage[]) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [nextRoute, prevRoute] = useRouteSequenceNavigation();

  const handleNext = () => {
    const result = pages[page]!();

    if (result === 'INELIGIBLE') {
      router.replace('../ineligible');
      return;
    }

    if (result === 'MISSING') {
      toast.error(t('quiz.missing'));
      return;
    }

    if (result === 'NEXT') {
      if (page < pages.length - 1) {
        void setPage(page + 1);
      } else {
        nextRoute();
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      void setPage(page - 1);
    } else {
      prevRoute();
    }
  };

  return {
    handleNext,
    handlePrev,
    page,
    setPage,
  }
}

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

  // TODO extract with pager too
  const { handleNext, handlePrev, page } = usePagedQuiz([
    () => {
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
    },
    () => {
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
    },
    () => {
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
    },
  ])

  return (
    <QuizLayout>
      <ReactivePagerView orientation="vertical" page={page} style={tw`flex-1`}>
        <View key="0">
          <QuizContents>
            <QuizPrimaryQuestionText>
              <Trans i18nKey="services.i589.eligibility.reason-for-leaving.is-escaping-harm" />
            </QuizPrimaryQuestionText>
            <QuizYesNoInput onChange={setIsEscapingHarm} value={isEscapingHarm} />
          </QuizContents>
        </View>
        <View key="1">
          <QuizContents>
            <QuizPrimaryQuestionText>
              <Trans i18nKey="services.i589.eligibility.reason-for-leaving.harm-reasons" />
            </QuizPrimaryQuestionText>
            <QuizCheckboxGroup onChange={setHarmReasons} value={harmReasons}>
              {HARM_REASONS.map((reason) => (
                <QuizCheckbox
                  exclusive={reason === 'none'}
                  key={reason}
                  label={t(`services.i589.eligibility.reason-for-leaving.reasons.${reason}`)}
                  value={reason}
                />
              ))}
            </QuizCheckboxGroup>
            <TextInput
              error={!!customHarmReasonError && !isCustomHarmReasonDirty}
              label={t('services.i589.eligibility.reason-for-leaving.other')}
              multiline={true}
              onChangeText={setCustomHarmReason}
              value={customHarmReason}
            />
          </QuizContents>
        </View>
        <View key="2">
          <QuizContents>
            <QuizPrimaryQuestionText>
              <Trans i18nKey="services.i589.eligibility.reason-for-leaving.is-harmed-by-gov" />
            </QuizPrimaryQuestionText>
            <QuizYesNoInput onChange={setIsHarmedByGov} value={isHarmedByGov} />
          </QuizContents>
        </View>
      </ReactivePagerView>
      <QuizActions>
        <QuizSecondaryActionButton onPress={handlePrev}>
          <Trans i18nKey="quiz.back" />
        </QuizSecondaryActionButton>
        <QuizPrimaryActionButton onPress={handleNext}>
          <Trans i18nKey="quiz.continue" />
        </QuizPrimaryActionButton>
      </QuizActions>
    </QuizLayout>
  );
}

