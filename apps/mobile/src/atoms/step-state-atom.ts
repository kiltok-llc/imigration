import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const stepStateAtom = atomFamily(
  ({ serviceId, stepId }: { serviceId: string; stepId: string }) =>
    atomWithMmkvStorage(
      `services:${serviceId}:${stepId}:state`,
      'pending',
      z.enum(['pending', 'active', 'completed']),
      defaultStorage
    ),
  isEqual
);
