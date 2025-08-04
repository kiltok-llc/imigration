import { useLocalSegments } from '@/hooks/use-local-segments';

export const useServiceId = () => {
  const [services, serviceId] = useLocalSegments();
  if (services !== 'services') {
    throw new Error("The first segment must be 'services'.");
  }

  if (!serviceId) {
    throw new Error('Service ID is not defined in the route segments.');
  }

  return serviceId;
};
