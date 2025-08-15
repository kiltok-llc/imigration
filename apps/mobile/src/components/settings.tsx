import { useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import * as React from 'react';
import { List } from 'react-native-paper';

import { Trans } from '@/components/trans';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

const SectionContext = createRequiredContext<string>();

export function SettingsItem({
  id,
  ...props
}: Partial<ComponentProps<typeof List.Item>> & { id: string }) {
  const router = useRouter();
  const section = useRequiredContext(SectionContext);
  return (
    <List.Item
      description={
        <Trans i18nKey={`settings.sections.${section}.${id}.description`} />
      }
      onPress={() => {
        router.push(`./settings/${id}`);
      }}
      right={(props) => <List.Icon {...props} icon='chevron-right' />}
      title={<Trans i18nKey={`settings.sections.${section}.${id}.title`} />}
      {...props}
    />
  );
}

export function SettingsSection({
  children,
  id,
  ...props
}: Partial<ComponentProps<typeof List.Section>> & { id: string }) {
  return (
    <List.Section {...props}>
      <List.Subheader>
        <Trans i18nKey={`settings.sections.${id}.title`} />
      </List.Subheader>
      <SectionContext value={id}>{children}</SectionContext>
    </List.Section>
  );
}
