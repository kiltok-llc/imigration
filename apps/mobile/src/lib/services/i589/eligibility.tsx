import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { mmkvStorage } from '@/lib/mmkv';

type EligibilityQuizAnswers = {
  appliedBefore?: boolean;
  arrivedWithinLastYear?: boolean;
  convictedSeriousCrime?: boolean;
  fromSafeCountry?: boolean;
  harmCausedByGovernment?: boolean;
  harmReasonOther?: string;
  harmReasons: HarmReason[];
  leftBecauseOfHarm?: boolean;
  physicallyInUS?: boolean;
}

export const HARM_REASONS = [
  'nationality', 'other', 'political-opinion', 'race', 'religion', 'social-group'
] as const;

export type HarmReason = typeof HARM_REASONS[number];


export const eligibilityQuizAnswersAtom = atomWithStorage<EligibilityQuizAnswers>(
  'services.i589.step.eligibility.questions',
  {
    harmReasons: [],
  },
  createJSONStorage(() => mmkvStorage),
  { getOnInit: true },
);