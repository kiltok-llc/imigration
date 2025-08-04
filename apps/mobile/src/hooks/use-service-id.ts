import { useSegments } from 'expo-router';

export const useServiceId = () => {
  const [services, serviceId] = useSegments() as string[];
  if (services !== 'services') {
    throw new Error("The first segment must be 'services'.");
  }

  if (!serviceId) {
    throw new Error('Service ID is not defined in the route segments.');
  }

  return serviceId;
};
