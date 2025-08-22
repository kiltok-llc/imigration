import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const stepStateAtom = atomFamily(
  ({ service, step }: { service: string; step: string }) =>
    atomWithMmkvStorage(
      `services:${service}:${step}:state`,
      'pending',
      z.enum(['pending', 'active', 'completed']),
      defaultStorage
    ),
  isEqual
);
