import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atom/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atom/object-property-atom-family';

export const HarmReasonEnum = z.enum([
  'nationality',
  'other',
  'political-opinion',
  'race',
  'religion',
  'social-group',
  'none',
]);

export type HarmReason = z.infer<typeof HarmReasonEnum>;

export const QuizAnswersSchema = z.object({
  customHarmReason: z.string().optional(),
  harmReasons: z.array(HarmReasonEnum),
  hasCriminalHistory: z.boolean().optional(),
  hasPreviousApp: z.boolean().optional(),
  isEscapingHarm: z.boolean().optional(),
  isFromSafeCountry: z.boolean().optional(),
  isHarmedByGov: z.boolean().optional(),
  isInUsa: z.boolean().optional(),
  isRecentArrival: z.boolean().optional(),
});

export type QuizAnswers = z.infer<typeof QuizAnswersSchema>;

export const quizAnswersAtom = atomWithMmkvStorage(
  'services.i589.eligibility.questions',
  { harmReasons: [] },
  QuizAnswersSchema,
);

export const quizAnswerFamily = objectPropertyAtomFamily(quizAnswersAtom);

export const savedQuizRouteAtom = atomWithMmkvStorage(
  'services.i589.eligibility.savedQuizRoute',
  'physical-presence',
  z.string(),
);