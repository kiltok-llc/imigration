import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { appStorage } from '@/lib/mmkv';

export const isOnboardingCompleteAtom = atomWithMmkvStorage(
  'is-onboarding-complete',
  false,
  z.boolean(),
  appStorage
);
