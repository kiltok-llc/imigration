import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useServiceId } from '@/hooks/use-service-id';

function getInitialStep(_serviceId: string) {
  return 'eligibility';
}

export const serviceStepFamily = atomFamily(
  ({ serviceId }: { serviceId: string }) =>
    atomWithMmkvStorage(
      `services.${serviceId}.step`,
      getInitialStep(serviceId),
      z.string()
    )
);

export const useServiceStepAtom = () => {
  const serviceId = useServiceId();
  return serviceStepFamily({ serviceId });
};
