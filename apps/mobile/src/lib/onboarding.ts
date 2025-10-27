import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { defaultStorage } from '@/lib/mmkv';

export const isOnboardingCompleteAtom = atomWithMMKVZod(
  'is-onboarding-complete',
  false,
  z.boolean(),
  defaultStorage
);
