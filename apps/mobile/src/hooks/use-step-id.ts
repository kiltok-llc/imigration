import { useLocalSegments } from '@/hooks/use-local-segments';

export const useStepId = () => {
  const [services, _serviceId, stepId] = useLocalSegments();
  if (services !== 'services') {
    console.log("The first segment must be 'services'.");
    return '';
  }

  if (!stepId) {
    console.log('Step ID is not defined in the route segments.');
    return '';
  }

  return stepId;
};
