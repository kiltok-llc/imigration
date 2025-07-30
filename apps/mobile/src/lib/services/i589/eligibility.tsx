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
  'services.i589.step.eligibility.quiz.questions',
  {
    harmReasons: [],
  },
  createJSONStorage(() => mmkvStorage),
  { getOnInit: true },
);

const pageIdAtom = atomWithStorage<typeof pageIds[number]>(
  'services.i589.step.eligibility.quiz.page',
  'physicallyInUS',
  createJSONStorage(() => mmkvStorage),
  { getOnInit: true },
);

const pageIdxAtom = atom(
  (get) => {
    const pageId = get(pageIdAtom);
    return pageIds.indexOf(pageId);
  },
  (_, set, update: number) => {
    const pageId = pageIds[update]!;
    set(pageIdAtom, pageId);
  },
);

const incrementPageAtom = atom(null, (get, set, update: number = 1) => {
  const index = get(pageIdxAtom);
  set(pageIdxAtom, (index + update) % pageIds.length);
});

const nextPageIdAtom = atom((get) => {
  const index = get(pageIdxAtom);
  return pageIds[index + 1];
});

