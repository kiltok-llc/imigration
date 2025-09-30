import { useLocalSegments } from '@/hooks/use-local-segments';

export const useScreen = () => {
  const [services, _service, _step, ...screen] = useLocalSegments();
  if (services !== 'services') {
    console.warn("[useScreen] first segment must be 'services'.");
    return '';
  }

  return screen.join('.');
};
