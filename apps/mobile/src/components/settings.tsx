import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ComponentProps, PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { SectionContext, useSettingsPath } from '@/lib/settings';
import { useT } from '@/lib/translation';

export function SettingsItem({
  icon,
  id,
  ...props
}: Partial<ComponentProps<typeof List.Item>> & { icon?: string; id?: string }) {
  const router = useRouter();
  const path = useSettingsPath();

  return (
    <List.Item
      description={id && <Trans i18nKey={`${path}.items.${id}.description`} />}
      onPress={
        id
          ? () => {
              router.navigate(`./${id}`, { relativeToDirectory: true });
            }
          : undefined
      }
      right={icon ? (props) => <List.Icon {...props} icon={icon} /> : undefined}
      title={id && <Trans i18nKey={`${path}.items.${id}.title`} />}
      {...props}
    />
  );
}

export function SettingsPage({ children }: PropsWithChildren) {
  return (
    <ScrollView contentContainerStyle={tw`grow`} style={tw`flex-1`}>
      <SafeAreaView edges={['bottom']} style={tw`flex-1`}>
        {children}
      </SafeAreaView>
    </ScrollView>
  );
}

export function SettingsScreen({ children }: PropsWithChildren) {
  const t = useT();
  const path = useSettingsPath();

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`${path}.screenTitle`),
        }}
      />
      {children}
    </>
  );
}

export function SettingsSection({
  children,
  id,
  ...props
}: Partial<ComponentProps<typeof List.Section>> & { id: string }) {
  const path = useSettingsPath();

  return (
    <List.Section {...props}>
      <List.Subheader>
        <Trans i18nKey={`${path}.sections.${id}.title`} />
      </List.Subheader>
      <SectionContext value={id}>{children}</SectionContext>
    </List.Section>
  );
}
