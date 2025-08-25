import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { appStorage } from '@/lib/mmkv';

export const isStepStartedAtom = atomFamily(
  ({ service, step }: { service: string; step: string }) =>
    atomWithMmkvStorage(
      `services:${service}:${step}:is-started`,
      false,
      z.boolean(),
      appStorage
    ),
  isEqual
);
