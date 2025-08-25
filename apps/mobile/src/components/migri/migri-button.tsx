import { ComponentProps } from 'react';
import { FAB } from 'react-native-paper';
import tw from 'twrnc';

import { MigriEncounterType, useTriggerMigri } from '@/lib/migri';
import { useT } from '@/lib/translation';

export function MigriButton({
  callback,
  extended = false,
  float = false,
  id,
  style,
  type = 'talk',
  ...props
}: Partial<ComponentProps<typeof FAB>> & {
  callback?: () => void;
  extended?: boolean;
  float?: boolean;
  id?: string;
  type?: MigriEncounterType;
}) {
  const triggerMigri = useTriggerMigri();
  const t = useT();

  return (
    <FAB
      icon='lightbulb-on-outline'
      label={extended ? t('migri.fab.label') : undefined}
      onPress={
        id
          ? () =>
              triggerMigri({
                callback,
                id,
                once: false,
                skipMissing: false,
                type,
              })
          : undefined
      }
      style={[tw.style(float && 'absolute right-6 bottom-6'), style]}
      {...props}
    />
  );
}
