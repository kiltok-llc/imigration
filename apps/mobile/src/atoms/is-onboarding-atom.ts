import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';

export const isOnboardedAtom = atomWithMmkvStorage(
  'isOnBoarded',
  false,
  z.boolean()
);
