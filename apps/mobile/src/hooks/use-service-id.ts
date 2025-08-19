import { useLocalSegments } from '@/hooks/use-local-segments';

export const useServiceId = () => {
  const [services, serviceId] = useLocalSegments();
  if (services !== 'services') {
    console.log("The first segment must be 'services'.");
    return '';
  }

  if (!serviceId) {
    console.log('Service ID is not defined in the route segments.');
    return '';
  }

  return serviceId;
};
