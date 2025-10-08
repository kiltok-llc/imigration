import { isEqual } from '@ver0/deep-equal';
import { atomFamily } from 'jotai/utils';
import { AtomFamily } from 'jotai/vanilla/utils/atomFamily';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

const atoms = new Map<string, AtomFamily<any, any>>();

export const quizChatAtomFamily = <T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T
) => {
  const anAtom = atomFamily(
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

  atoms.set(key, anAtom);

  return anAtom;
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
