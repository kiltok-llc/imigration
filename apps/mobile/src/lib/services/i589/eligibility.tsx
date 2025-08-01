import { useAtom } from 'jotai';

import { atomWithMmkvStorage } from '@/atom/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atom/object-property-atom-family';

type QuizAnswers = {
  customHarmReason?: string;
  harmReasons: HarmReason[];
  isConvictedOfCrime?: boolean;
  isEscapingHarm?: boolean;
  isFirstApplication?: boolean;
  isFromSafeCountry?: boolean;
  isHarmedByGov?: boolean;
  isInUsa?: boolean;
  isRecentArrival?: boolean;
}

export const HARM_REASONS = [
  'nationality', 'other', 'political-opinion', 'race', 'religion', 'social-group', 'none',
] as const;

export type HarmReason = typeof HARM_REASONS[number];


export const quizAnswersAtom = atomWithMmkvStorage<QuizAnswers>(
  'services.i589.eligibility.questions',
  {
    harmReasons: [],
  },
);

export const quizAnswerFamily = objectPropertyAtomFamily(quizAnswersAtom);