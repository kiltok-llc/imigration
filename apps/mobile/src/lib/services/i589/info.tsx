import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atoms/object-property-atom-family';

export const HarmReasonEnum = z.enum([
  'nationality',
  'other',
  'political-opinion',
  'race',
  'religion',
  'social-group',
  'none',
]);

export const AnswersSchema = z.object({
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

export const answersAtom = atomWithMmkvStorage(
  'services.i589.info.answers',
  { harmReasons: [] },
  AnswersSchema
);

export const answerFamily = objectPropertyAtomFamily(answersAtom);
