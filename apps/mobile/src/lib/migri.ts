import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { appStorage } from '@/lib/mmkv';
import { useT } from '@/lib/translation';

export const migriVoiceAtom = atomWithMmkvStorage<null | string>(
  'migri:voice',
  null,
  z.string().nullable(),
  appStorage
);

export const isMigriSpeechEnabledAtom = atomWithMmkvStorage(
  'migri:speech-enabled',
  true,
  z.boolean(),
  appStorage
);

export const migriCompletedEncounterIds = atomWithMmkvStorage<Set<string>>(
  'migri:completed-encounter-ids',
  new Set(),
  z.set(z.string()),
  appStorage
);

const migriEncounterQueueAtom = atom<MigriEncounter[]>([]);

export type MigriAction =
  | {
      encounter: MigriEncounter;
      type: 'push';
    }
  | {
      type: 'pop';
    };

export type MigriEncounter = {
  callback?: () => void;
  id: string;
  key?: string;
  once: boolean;
  skipMissing: boolean;
  type: MigriEncounterType;
};

export type MigriEncounterType = 'talk';

const randomKey = () => Math.random().toString(36).slice(2);

export const useCurrentMigri = () => {
  const [head] = useAtomValue(migriEncounterQueueAtom);
  return head;
};

export const useDismissMigri = () => {
  const setQueue = useSetAtom(migriEncounterQueueAtom);
  return () => setQueue((queue) => queue.slice(1));
};

export const useTriggerMigri = () => {
  const setMigriState = useSetAtom(migriEncounterQueueAtom);
  const t = useT();
  const [completedEncounterIds, setCompletedEncounterIds] = useAtom(
    migriCompletedEncounterIds
  );
  return (encounter: MigriEncounter) => {
    if (encounter.once && completedEncounterIds.has(encounter.id)) {
      return;
    }

    if (
      encounter.skipMissing &&
      !Array.isArray(
        t(`migri.${encounter.id}.${encounter.type}`, { returnObjects: true })
      )
    ) {
      console.debug(
        'Skipping migri encounter because translation is missing for id:',
        encounter.id
      );
      return;
    }

    setCompletedEncounterIds((ids) => ids.add(encounter.id));
    setMigriState((state) => [...state, { key: randomKey(), ...encounter }]);
  };
};
