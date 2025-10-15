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

const QuizPageRefContext = createRequiredContext<
  Ref<QuizPageHandle> | undefined
>();
export const QuizPageRefProvider = QuizPageRefContext.Provider;
export const useQuizPageHandle = (init: () => QuizPageHandle) =>
  useImperativeHandle(useRequiredContext(QuizPageRefContext), init);

export function QuizPage({
  children,
  pageId,
  pageKey = '',
  pageRef,
}: PropsWithChildren<QuizPageProps>) {
  return (
    <QuizPageRefProvider value={pageRef}>
      <QuizPageIdProvider value={pageId}>
        <QuizPageKeyProvider value={pageKey}>{children}</QuizPageKeyProvider>
      </QuizPageIdProvider>
    </QuizPageRefProvider>
  );
}
