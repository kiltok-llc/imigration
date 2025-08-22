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

export function resetQuizRoute({
  service,
  step,
}: {
  service: string;
  step: string;
}) {
  console.log(`Clearing quiz route for ${service}.${step}`);
  quizRouteAtom.remove({ service, step });

  const key = `services:${service}:${step}:route`;
  if (quizStorage.contains(key)) {
    console.debug(`Clearing storage key: ${key}`);
    quizStorage.delete(key);
  }
}
