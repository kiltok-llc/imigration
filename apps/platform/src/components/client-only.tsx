import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

function ClientOnlyInner({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export const ClientOnly = dynamic(() => Promise.resolve(ClientOnlyInner), {
  ssr: false,
});
