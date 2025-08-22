import { useLocalSegments } from '@/hooks/use-local-segments';

export const useService = () => {
  const [services, service] = useLocalSegments();
  if (services !== 'services') {
    console.log("The first segment must be 'services'.");
    return '';
  }

  if (!service) {
    console.log('Service ID is not defined in the route segments.');
    return '';
  }

  return service;
};
