import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { quizStorage } from '@/lib/mmkv';

export const quizRouteAtom = atomFamily(
  ({ service, step }: { service: string; step: string }) =>
    atomWithMmkvStorage(
      `services:${service}:${step}:route`,
      null,
      z.string().nullable(),
      quizStorage
    ),
  isEqual
);
