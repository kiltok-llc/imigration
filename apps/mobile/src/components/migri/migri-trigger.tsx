import { useEffect, useRef } from 'react';

import { MigriEncounterType, useTriggerMigri } from '@/lib/migri';

export function MigriTrigger({
  id,
  once,
  type,
}: {
  id: string;
  once: boolean;
  type: MigriEncounterType;
}) {
  const triggerMigri = useTriggerMigri();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!triggeredRef.current) {
      triggeredRef.current = true;
      triggerMigri({ id, once, type });
    }
  }, [id, once, triggerMigri, type]);

  return null;
}
