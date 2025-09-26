import { useIsFocused } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { isMigriTriggersEnabledAtom, triggerMigri } from '@/lib/migri';

export function MigriTrigger({ id }: { id: string }) {
  const isFocused = useIsFocused();
  const isMigriTriggersEnabled = useAtomValue(isMigriTriggersEnabledAtom);

  useEffect(() => {
    if (!isMigriTriggersEnabled) {
      return;
    }

    if (!isFocused) {
      return;
    }

    triggerMigri(id, { once: true, skip: true });
  }, [id, isFocused, isMigriTriggersEnabled]);

  return null;
}
