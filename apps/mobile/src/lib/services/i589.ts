import { atom } from 'jotai';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const I589StepEnum = z.enum([
  'eligibility',
  'info',
  'statement',
  'review',
  'waiting',
  'interview',
  'decision',
  'appeal',
]);

export type I589Step = z.infer<typeof I589StepEnum>;

export const i589StepAtom = atomWithMmkvStorage(
  `services:i589:step`,
  'eligibility',
  I589StepEnum,
  defaultStorage
);

export const i589StepIdxAtom = atom(
  (get) => I589StepEnum.options.indexOf(get(i589StepAtom)),
  (_get, set, idx: number) => set(i589StepAtom, I589StepEnum.options[idx]!)
);
