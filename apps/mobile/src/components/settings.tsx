import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { DrawerToggleButton } from '@/components/drawer';
import { Trans } from '@/components/trans';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { useT } from '@/hooks/use-t';

const SectionContext = createContext<string | undefined>(undefined);
export const useSettingsSection = () => useContext(SectionContext);
export const useSettingsPath = () => {
  const path = useLocalSegments().join('.');
  const section = useSettingsSection();
  if (!section) {
    return path;
  }
  return `${path}.sections.${section}`;
};

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
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const path = useSettingsPath();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: ({ tintColor }) => (
            <DrawerToggleButton navigation={navigation} tintColor={tintColor} />
          ),
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
