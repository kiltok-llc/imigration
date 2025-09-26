import { atom, getDefaultStore, useAtomValue, useSetAtom } from 'jotai';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import i18n from '@/i18n';
import { defaultStorage } from '@/lib/mmkv';

export const migriVoiceAtom = atomWithMmkvStorage(
  'migri:voice',
  null,
  z.string().nullable(),
  defaultStorage
);

export const isMigriTriggersEnabledAtom = atomWithMmkvStorage(
  'migri:triggers-enabled',
  true,
  z.boolean(),
  defaultStorage
);

export const isMigriSpeechEnabledAtom = atomWithMmkvStorage(
  'migri:speech-enabled',
  false,
  z.boolean(),
  defaultStorage
);

export const migriCompletedEncounterIds = atomWithMmkvStorage<Set<string>>(
  'migri:completed-encounter-ids',
  new Set(),
  z.set(z.string()),
  defaultStorage
);

export const migriEncounterQueueAtom = atom<MigriEncounter[]>([]);

export const useCurrentMigriEncounter = () => {
  const [current] = useAtomValue(migriEncounterQueueAtom);
  return current;
};

export const useDismissCurrentMigriEncounter = () => {
  const setMigriEncounters = useSetAtom(migriEncounterQueueAtom);
  return () => setMigriEncounters((encounters) => encounters.slice(1));
};

export type MigriEncounter = {
  callback?: () => void;
  id: string;
  key: string;
};

const randomKey = () => Math.random().toString(36).slice(2);

const defaultStore = getDefaultStore();

type MigriOptions = {
  callback?: () => void;
  once?: boolean;
  skip?: boolean;
};

export function triggerMigri(
  id: string,
  { callback, once = false, skip = false }: MigriOptions = {}
) {
  const completed = defaultStore.get(migriCompletedEncounterIds);
  if (once && completed.has(id)) {
    console.debug('Skipping migri encounter because it was already completed', {
      id,
    });
    return;
  }

  if (
    skip &&
    !Array.isArray(i18n.t(`migri.${id}.talk`, { returnObjects: true }))
  ) {
    console.debug('Skipping migri encounter because translation is missing', {
      id,
    });
    return;
  }

  console.debug('Triggering migri encounter', { id });
  defaultStore.set(migriCompletedEncounterIds, (ids) => new Set([id, ...ids]));
  defaultStore.set(migriEncounterQueueAtom, (encounters) => [
    ...encounters,
    { callback, id, key: randomKey(), type: 'talk' },
  ]);
}
