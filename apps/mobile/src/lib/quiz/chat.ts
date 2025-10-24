import { isEqual } from '@ver0/deep-equal';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { ReactNode } from 'react';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { createChatMessageStorage, UIMessage } from '@/lib/chat';
import { defaultStorage } from '@/lib/mmkv';
import { useQuizPageAtomKey } from '@/lib/quiz/page';

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

export const quizChatMessagesAtomFamily = (key: string) => {
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
      atomWithStorage<UIMessage[]>(
        `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:chat:${key}`,
        [],
        createChatMessageStorage(defaultStorage),
        {
          getOnInit: true,
        }
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

export const quizChatMessagesAtom = quizChatMessagesAtomFamily(
  'messages',
  z.array(QuizChatMessageSchema),
  []
);
export const useQuizChatMessagesAtom = () =>
  quizChatMessagesAtom(useQuizPageAtomKey());

export const quizChatInputAtom = quizChatAtomFamily('input', z.string(), '');
export const useQuizChatInputAtom = () =>
  quizChatInputAtom(useQuizPageAtomKey());

export const quizChatChipsAtom = quizChatAtomFamily(
  'chips',
  z.array(z.string()),
  []
);
export const useQuizChatChipsAtom = () =>
  quizChatChipsAtom(useQuizPageAtomKey());

export const quizChatStateAtom = quizChatAtomFamily(
  'state',
  z.enum(['in-progress', 'completed']),
  'in-progress'
);
export const useQuizChatStateAtom = () =>
  quizChatStateAtom(useQuizPageAtomKey());

export type QuizChatActionChip = {
  id: string;
  render: () => ReactNode;
};
