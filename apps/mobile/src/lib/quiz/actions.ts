import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

type QuizActions = {
  handleBack?: () => void;
  handleContinue?: () => void;
  setHandleBack: (handleBack?: () => void) => void;
  setHandleContinue: (handleContinue?: () => void) => void;
};

export const QuizActionsContext = createRequiredContext<QuizActions>();

export const useQuizActions = () => useRequiredContext(QuizActionsContext);
