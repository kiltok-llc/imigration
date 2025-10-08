import { PropsWithChildren, Ref, useImperativeHandle } from 'react';

import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

export type QuizPageHandle = {
  reset: () => void;
  submit: () => Promise<boolean>;
};
export type QuizPageProps = {
  pageId: string;
  pageKey?: string;
  pageRef?: Ref<QuizPageHandle>;
};

const QuizPageIdContext = createRequiredContext<string>();
export const QuizPageIdProvider = QuizPageIdContext.Provider;
export const useQuizPageId = () => useRequiredContext(QuizPageIdContext);

const QuizPageKeyContext = createRequiredContext<string>();
export const QuizPageKeyProvider = QuizPageKeyContext.Provider;
export const useQuizPageKey = () => useRequiredContext(QuizPageKeyContext);

export function QuizPage({
  children,
  onReset = () => {},
  onSubmit = async () => true,
  pageId,
  pageKey = '',
  pageRef,
}: PropsWithChildren<QuizPageProps> & {
  onReset?: () => void;
  onSubmit?: () => Promise<boolean>;
}) {
  useImperativeHandle(pageRef, () => ({
    reset: onReset,
    submit: onSubmit,
  }));

  return (
    <QuizPageIdProvider value={pageId}>
      <QuizPageKeyProvider value={pageKey}>{children}</QuizPageKeyProvider>
    </QuizPageIdProvider>
  );
}
