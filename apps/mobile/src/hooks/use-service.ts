import { useLocalSegments } from '@/hooks/use-local-segments';

export const useService = () => {
  const [services, service] = useLocalSegments();
  if (services !== 'services') {
    console.warn("[useService] the first segment must be 'services'.");
    return '';
  }

  if (!service) {
    console.warn('Service ID is not defined in the route segments.');
    return '';
  }

  return service;
};
