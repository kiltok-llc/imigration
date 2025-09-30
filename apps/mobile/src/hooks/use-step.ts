import { useLocalSegments } from '@/hooks/use-local-segments';

export const useStep = () => {
  const [services, _service, step] = useLocalSegments();
  if (services !== 'services') {
    console.warn(`[useStep] the first segment must be 'services'.`);
    return '';
  }

  if (!step) {
    console.warn('Step ID is not defined in the route segments.');
    return '';
  }

  return step;
};
