import { useIsFocused } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import {
  isMigriTriggersEnabledAtom,
  MigriEncounterType,
  useTriggerMigri,
} from '@/lib/migri';

export function MigriTrigger({
  id,
  once = true,
  type,
}: {
  id: string;
  once?: boolean;
  type: MigriEncounterType;
}) {
  const triggerMigri = useTriggerMigri();
  const isFocused = useIsFocused();
  const isMigriTriggersEnabled = useAtomValue(isMigriTriggersEnabledAtom);

  useEffect(() => {
    if (!isMigriTriggersEnabled || !isFocused) {
      return;
    }
    triggerMigri({ id, once, skipMissing: true, type });
  }, [id, isFocused, isMigriTriggersEnabled, once, triggerMigri, type]);

  return null;
}
