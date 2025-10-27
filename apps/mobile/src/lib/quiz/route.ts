import { isEqual } from '@ver0/deep-equal';
import { useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useEffect } from 'react';
import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { defaultStorage } from '@/lib/mmkv';
import { useCurrentRouteUrl, useRouteUrls } from '@/lib/routes';

export const quizRouteAtom = atomFamily(
  ({ service, step }: { service: string; step: string }) =>
    atomWithMMKVZod(
      `services:${service}:${step}:route`,
      null,
      z.string().nullable(),
      defaultStorage
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
  if (defaultStorage.contains(key)) {
    console.debug(`Clearing storage key: ${key}`);
    defaultStorage.delete(key);
  }
}

export const useSyncQuizRoute = () => {
  const [_services, service = '', step = ''] = useLocalSegments();
  const routes = useRouteUrls();
  const currentRouteUrl = useCurrentRouteUrl();
  const saveQuizRoute = useSetAtom(quizRouteAtom({ service, step }));
  useEffect(() => {
    if (routes.includes(currentRouteUrl)) {
      saveQuizRoute(currentRouteUrl);
    }
  }, [currentRouteUrl, routes, saveQuizRoute]);
};
