import { PropsWithChildren, ReactNode } from 'react';

export function QuizChatActionChip({
  description,
  id,
  name,
  render,
}: {
  description: string;
  id: string;
  name: string;
  render: () => ReactNode;
}) {
  return null;
}

export function QuizChatActionChips({ children }: PropsWithChildren) {
  return children;
}
