import { useMemo } from 'react';
import { StoreApi, useStore } from 'zustand';

import { createRequiredContext, useRequiredContext } from '@/hooks/use-required-context';

export interface Service {
  id: string;
  steps: Step[];
}

export type ServiceState = {
  id: string;
  setStep: (step: string) => void;
  step: string;
}

export interface Step {
  id: string;
}

export const ServiceContext = createRequiredContext<StoreApi<ServiceState>>();

export const useServiceStore = <T>(selector: (state: ServiceState) => T) => useStore(useRequiredContext(ServiceContext), selector);

export const useService = () => {
  const id = useServiceStore((state) => state.id)
  return services.find((service) => service.id === id)!;
};

export const useServiceStep = () => {
  const service = useService();
  const stepId = useServiceStore((state) => state.step)
  return service.steps.find((step) => step.id === stepId)!;
};

export const services: Service[] = [
  {
    id: 'i589',
    steps: [
      { id: 'eligibility' },
    ],
  },
];