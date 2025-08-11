import { useLocalSegments } from '@/hooks/use-local-segments';

export const useQuizScreenId = () => {
  const [services, _serviceId, _stepId, quiz, ...screenId] = useLocalSegments();
  if (services !== 'services') {
    throw new Error("The first segment must be 'services'.");
  }

  if (quiz !== 'quiz') {
    throw new Error("The fourth segment must be 'quiz'.");
  }

  if (screenId.length === 0) {
    throw new Error('Screen ID is not defined in the route segments.');
  }

  return screenId.join('.');
};
