import { PropsWithChildren, useState } from 'react';

import { QuizActionsContext } from '@/lib/quiz/actions';
import { useSyncQuizRoute } from '@/lib/quiz/route';

export function QuizProvider({ children }: PropsWithChildren) {
  const [handleBack, setHandleBack] = useState<() => void>();
  const [handleContinue, setHandleContinue] = useState<() => void>();

  useSyncQuizRoute();

  return (
    <QuizActionsContext.Provider
      value={{
        handleBack,
        handleContinue,
        setHandleBack: (handler) => setHandleBack(() => handler),
        setHandleContinue: (handler) => setHandleContinue(() => handler),
      }}
    >
      {children}
    </QuizActionsContext.Provider>
  );
}
