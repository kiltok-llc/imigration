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

type HarmReason = 'nationality' | 'other' | 'politicalOpinion' | 'race' | 'religion' | 'socialGroup';

export const eligibilityQuizAnswersAtom = atomWithStorage<EligibilityQuizAnswers>(
  'services.i589.step.eligibility.questions',
  {
    harmReasons: [],
  },
  createJSONStorage(() => mmkvStorage),
  { getOnInit: true },
);