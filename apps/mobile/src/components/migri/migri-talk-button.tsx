import { ComponentProps } from 'react';
import { FAB } from 'react-native-paper';
import tw from 'twrnc';

import { triggerMigri } from '@/lib/migri';
import { useT } from '@/lib/translation';

export function MigriButton({
  callback,
  extended = false,
  float = false,
  id,
  style,
  ...props
}: Partial<ComponentProps<typeof FAB>> & {
  callback?: () => void;
  extended?: boolean;
  float?: boolean;
  id: string;
}) {
  const t = useT();

  return (
    <FAB
      icon='lightbulb-on-outline'
      label={extended ? t('migri.fab.label') : undefined}
      onPress={() => triggerMigri(id, { callback })}
      style={[tw.style(float && 'absolute right-6 bottom-6'), style]}
      {...props}
    />
  );
}
