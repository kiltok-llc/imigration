import { useLocalSegments } from '@/hooks/use-local-segments';

export const useQuizScreenId = () => {
  const [services, _serviceId, _stepId, ...screenId] = useLocalSegments();
  if (services !== 'services') {
    console.log("The first segment must be 'services'.");
    return '';
  }

  if (screenId.length === 0) {
    console.log('Screen ID is not defined in the route segments:', screenId);
    return '';
  }

  return screenId.join('.');
};
