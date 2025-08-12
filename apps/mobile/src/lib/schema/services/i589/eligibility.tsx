import z from 'zod/v4';

export const HarmReasonEnum = z.enum([
  'nationality',
  'other',
  'political-opinion',
  'race',
  'religion',
  'social-group',
  'none',
]);