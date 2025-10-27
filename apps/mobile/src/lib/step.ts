import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { defaultStorage } from '@/lib/mmkv';

export const isStepStartedAtom = atomFamily(
  ({ service, step }: { service: string; step: string }) =>
    atomWithMMKVZod(
      `services:${service}:${step}:is-started`,
      false,
      z.boolean(),
      defaultStorage
    ),
  isEqual
);
