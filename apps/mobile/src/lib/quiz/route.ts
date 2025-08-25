import { isEqual } from '@ver0/deep-equal';
import { useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useEffect } from 'react';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { quizStorage } from '@/lib/mmkv';
import { useCurrentRouteUrl, useRouteUrls } from '@/lib/routes';

export const quizRouteAtom = atomFamily(
  ({ service, step }: { service: string; step: string }) =>
    atomWithMmkvStorage(
      `services:${service}:${step}:route`,
      null,
      z.string().nullable(),
      quizStorage
    ),
  isEqual
);

export function resetQuizRoute({
  service,
  step,
}: {
  service: string;
  step: string;
}) {
  console.log(`Clearing quiz route for ${service}.${step}`);
  quizRouteAtom.remove({ service, step });

  const key = `services:${service}:${step}:route`;
  if (quizStorage.contains(key)) {
    console.debug(`Clearing storage key: ${key}`);
    quizStorage.delete(key);
  }
}

export const useSyncQuizRoute = () => {
  const service = useService();
  const step = useStep();
  const routes = useRouteUrls();
  const currentRouteUrl = useCurrentRouteUrl();
  const saveQuizRoute = useSetAtom(quizRouteAtom({ service, step }));
  useEffect(() => {
    if (routes.includes(currentRouteUrl)) {
      saveQuizRoute(currentRouteUrl);
    }
  }, [currentRouteUrl, routes, saveQuizRoute]);
};
