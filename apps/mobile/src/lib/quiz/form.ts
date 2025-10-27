import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { defaultStorage } from '@/lib/mmkv';
import { clearMMKVKeys } from '@/lib/utils';

export const quizFormAtom = atomFamily(
  ({
    pageId,
    pageKey = '',
    screen,
    screenKey = '',
    service,
    step,
  }: {
    pageId: string;
    pageKey: string | undefined;
    screen: string;
    screenKey: string | undefined;
    service: string;
    step: string;
  }) =>
    atomWithMMKVZod(
      `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:values`,
      null,
      z.looseObject({}).nullable(),
      defaultStorage
    ),
  isEqual
);

export function resetQuizForm({
  screen,
  service,
  step,
}: {
  screen: string;
  service: string;
  step: string;
}) {
  console.log(`Clearing quiz values for ${service}.${step}`);
  const exp = new RegExp(
    `^services:${service}:${step}:${screen}:([^:]*):([^:]*):([^:]*):values$`
  );

  for (const [screenKey, pageId, pageKey] of clearMMKVKeys<
    [string, string, string]
  >(exp, defaultStorage)) {
    quizFormAtom.remove({
      pageId,
      pageKey,
      screen,
      screenKey,
      service,
      step,
    });
  }
}
