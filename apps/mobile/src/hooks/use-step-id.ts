import { useSegments } from 'expo-router';

export const useStepId = () => {
  const [services, _serviceId, stepId] = useSegments() as string[];
  if (services !== 'services') {
    throw new Error("The first segment must be 'services'.");
  }

  if (!stepId) {
    throw new Error('Step ID is not defined in the route segments.');
  }

  return stepId;
};
