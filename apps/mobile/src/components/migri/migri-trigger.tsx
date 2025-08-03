import { useEffect } from 'react';

import { MigriEncounterType, useTriggerMigri } from '@/lib/migri';

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

  useEffect(() => {
    triggerMigri({ id, once, skipMissing: true, type });
  }, [id, once, triggerMigri, type]);

  return null;
}
