import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import { ReactNode } from 'react';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { CactusActionChip } from '@/lib/cactus';
import { defaultStorage } from '@/lib/mmkv';

const atoms = new Map<string, ReturnType<typeof atomFamily>>();

export const quizChatAtomFamily = <T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T
) => {
  const family = atomFamily(
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
      atomWithMmkvStorage(
        `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:chat:${key}`,
        initialValue,
        schema,
        defaultStorage
      ),
    isEqual
  );

  atoms.set(key, family as ReturnType<typeof atomFamily>);

  return family;
};

const QuizChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

export type QuizChatMessage = z.infer<typeof QuizChatMessageSchema>;

export const quizChatMessagesAtom = quizChatAtomFamily(
  'messages',
  z.array(QuizChatMessageSchema),
  []
);

export const quizChatInputAtom = quizChatAtomFamily('input', z.string(), '');

export const quizChatChipsAtom = quizChatAtomFamily(
  'chips',
  z.array(z.string()),
  []
);

export type QuizChatActionChip = CactusActionChip & {
  render: () => ReactNode;
};
