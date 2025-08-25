import { useLocalSegments } from '@/hooks/use-local-segments';

export const useScreen = () => {
  const [services, _service, _step, ...screen] = useLocalSegments();
  if (services !== 'services') {
    console.log("The first segment must be 'services'.");
    return '';
  }

  if (screen.length === 0) {
    console.log('Screen ID is not defined in the route segments:', screen);
    return '';
  }

  return screen.join('.');
};
