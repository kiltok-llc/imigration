import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const stepAtom = atomFamily(
  ({ service }: { service: string }) =>
    atomWithMmkvStorage(
      `services:${service}:step`,
      '',
      z.string(),
      defaultStorage
    ),
  isEqual
);
