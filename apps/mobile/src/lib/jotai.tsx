import { useQueryClient } from '@tanstack/react-query';
import { queryClientAtom } from 'jotai-tanstack-query';
import { useHydrateAtoms } from 'jotai/utils';
import { PropsWithChildren } from 'react';

export function JotaiProvider({ children }: PropsWithChildren) {
  return <HydrateAtoms>{children}</HydrateAtoms>;
}

function HydrateAtoms({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  useHydrateAtoms([[queryClientAtom, queryClient]]);

  return children;
}
