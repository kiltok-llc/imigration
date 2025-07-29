import {PropsWithChildren, useState} from "react";
import {createStore} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

import {mmkvStateStorage} from "@/lib/mmkv";
import {ServiceContext, ServiceState} from '@/lib/service';

export function ServiceProvider({
                                  children,
                                  service
                                }: PropsWithChildren<{
  service: string;
}>) {
  const [store] = useState(() => createStore<ServiceState>()(persist((set) => ({
    id: service,
    setStep: (step: number) => set({step}),
    step: 0,
  }), {
    name: `service.${service}`,
    storage: createJSONStorage(() => mmkvStateStorage)
  })));

  return (
    <ServiceContext.Provider value={store}>
      {children}
    </ServiceContext.Provider>
  );
}