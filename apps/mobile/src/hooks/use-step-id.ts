import { useLocalSegments } from '@/hooks/use-local-segments';

export const useStepId = () => {
  const [services, _serviceId, stepId] = useLocalSegments();
  if (services !== 'services') {
    throw new Error("The first segment must be 'services'.");
  }

  if (!stepId) {
    throw new Error('Step ID is not defined in the route segments.');
  }

  return stepId;
};
