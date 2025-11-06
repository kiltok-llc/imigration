import { isEqual } from '@ver0/deep-equal';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { ReactNode } from 'react';
import z from 'zod/v4';

import { atomWithMMKVChatMessages } from '@/atoms/atom-with-chat-messages';
import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { defaultStorage } from '@/lib/mmkv';
import { useQuizPageAtomKey } from '@/lib/quiz/page';

const persistedAtoms = new Map<string, ReturnType<typeof atomFamily>>();

export const quizChatAtomFamily = <T>(initialValue: T) =>
  atomFamily(
    (_key: {
      pageId: string;
      pageKey: string | undefined;
      screen: string;
      screenKey: string | undefined;
      service: string;
      step: string;
    }) => atom(initialValue),
    isEqual
  );

export const quizChatMMKVAtomFamily = <T>(
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
      atomWithMMKVZod(
        `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:chat:${key}`,
        initialValue,
        schema,
        defaultStorage
      ),
    isEqual
  );

  persistedAtoms.set(key, family as ReturnType<typeof atomFamily>);

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
      atomWithMMKVChatMessages(
        `services:${service}:${step}:${screen}:${screenKey}:${pageId}:${pageKey}:chat:${key}`,
        [],
        defaultStorage
      ),
    isEqual
  );

  persistedAtoms.set(key, family as ReturnType<typeof atomFamily>);

  return family;
};

export const quizShowUploadDialogAtom = quizChatAtomFamily(false);
export const useQuizShowUploadDialogAtom = () =>
  quizShowUploadDialogAtom(useQuizPageAtomKey());

export const quizChatMessagesAtom = quizChatMessagesAtomFamily('messages');
export const useQuizChatMessagesAtom = () =>
  quizChatMessagesAtom(useQuizPageAtomKey());

export const quizChatInputAtom = quizChatMMKVAtomFamily(
  'input',
  z.string(),
  ''
);
export const useQuizChatInputAtom = () =>
  quizChatInputAtom(useQuizPageAtomKey());

export const quizChatChipsAtom = quizChatMMKVAtomFamily(
  'chips',
  z.array(z.string()),
  []
);
export const useQuizChatChipsAtom = () =>
  quizChatChipsAtom(useQuizPageAtomKey());

export const quizChatStateAtom = quizChatMMKVAtomFamily(
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
