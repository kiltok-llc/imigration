import * as React from 'react';
import { PropsWithChildren, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import {
  Dialog,
  IconButton,
  List,
  Menu,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import superjson from 'superjson';
import tw from 'twrnc';

import {
  SettingsItem,
  SettingsPage,
  SettingsScreen,
  SettingsSection,
} from '@/components/settings';
import { Trans, TransButton } from '@/components/trans';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { defaultStorage } from '@/lib/mmkv';
import { useSettingsPath } from '@/lib/settings';

const EditorPopupContext = createRequiredContext<{
  key: string;
  open: boolean;
  setKey: (key: string) => void;
  setOpen: (open: boolean) => void;
}>();

type Key = {
  name: string;
  storageKey: string;
};

type Tree = {
  keys: Key[];
  name: string;
  trees: Tree[];
};

export default function Data() {
  const tree = useMemo(() => asTree(defaultStorage.getAllKeys()), []);

  return (
    <DataEditorProvider>
      <SettingsScreen>
        <SettingsPage>
          <SettingsSection id='user'>
            {tree.trees.map((subTree) => (
              <Tree key={`${subTree.name}-tree`} {...subTree} />
            ))}
            {tree.keys.map((key) => (
              <KeyItem key={key.storageKey} {...key} />
            ))}
          </SettingsSection>
        </SettingsPage>
      </SettingsScreen>
    </DataEditorProvider>
  );
}

function asTree(storageKeys: string[], depth = 1, name = ''): Tree {
  // filter out leaf nodes
  const keys: Key[] = [];
  const parents: Record<string, string[]> = {};

  for (const key of storageKeys) {
    const parts = key.split(':');
    const name = parts[depth - 1]!;

    if (parts.length === depth) {
      keys.push({ name, storageKey: key });
      continue;
    }

    parents[name] ??= [];
    parents[name].push(key);
  }

  const trees = Object.entries(parents).map(([name, keys]) =>
    asTree(keys, depth + 1, name)
  );

  return {
    keys,
    name,
    trees,
  };
}

function DataEditorProvider({ children }: PropsWithChildren) {
  const [key, setKey] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useMMKVString(key, defaultStorage);
  const path = useSettingsPath();

  return (
    <EditorPopupContext.Provider
      value={{
        key,
        open,
        setKey,
        setOpen,
      }}
    >
      <Portal>
        <Dialog onDismiss={() => setOpen(false)} visible={open}>
          <Dialog.Title>
            <Trans i18nKey={`${path}.editor.title`} />
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <TextInput
                multiline={true}
                onChangeText={setValue}
                value={value}
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <TransButton
              i18nKey={`${path}.editor.close`}
              onPress={() => setOpen(false)}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {children}
    </EditorPopupContext.Provider>
  );
}

const NESTING_OFFSET = 40;

function KeyItem({
  name,
  nesting = 0,
  storageKey,
}: Key & { nesting?: number }) {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [json, _] = useMMKVString(storageKey, defaultStorage);
  const [value, error] = useMemo(() => {
    if (json === undefined) {
      return [undefined, false] as const;
    }

    try {
      const parsed = superjson.parse(json);
      const serialized = superjson.serialize(parsed);
      return [JSON.stringify(serialized.json), false] as const;
    } catch {
      return ['ERROR', true] as const;
    }
  }, [json]);

  const { setKey: setEditorKey, setOpen: setEditorOpen } =
    useRequiredContext(EditorPopupContext);
  const path = useSettingsPath();

  if (value === undefined) {
    return null;
  }

  return (
    <SettingsItem
      description={value}
      descriptionStyle={tw.style('font-mono text-xs', {
        color: error ? theme.colors.error : undefined,
      })}
      right={(props) => (
        <Menu
          anchor={
            <IconButton
              {...props}
              icon='dots-horizontal'
              onPress={() => setMenuOpen(true)}
            />
          }
          onDismiss={() => setMenuOpen(false)}
          visible={menuOpen}
        >
          <Menu.Item
            leadingIcon='square-edit-outline'
            onPress={() => {
              setMenuOpen(false);
              setEditorKey(storageKey);
              setEditorOpen(true);
            }}
            title={<Trans i18nKey={`${path}.menu.edit`} />}
          />
          <Menu.Item
            leadingIcon='trash-can'
            onPress={() => {
              setMenuOpen(false);
              defaultStorage.delete(storageKey);
            }}
            theme={{
              colors: {
                onSurfaceVariant: theme.colors.error,
              },
            }}
            title={<Trans i18nKey={`${path}.menu.delete`} />}
            titleStyle={{ color: theme.colors.error }}
          />
        </Menu>
      )}
      style={{
        paddingLeft: NESTING_OFFSET * nesting,
      }}
      title={name}
      titleStyle={{
        color: error ? theme.colors.error : undefined,
      }}
    />
  );
}

function Tree({ keys, name, nesting = 0, trees }: Tree & { nesting?: number }) {
  return (
    <List.Accordion
      containerStyle={tw.style({
        paddingLeft: NESTING_OFFSET * nesting,
      })}
      left={(props) => <List.Icon {...props} icon='folder' />}
      title={name}
    >
      {trees.map((subTree) => (
        <Tree key={`${subTree.name}-tree`} nesting={nesting + 1} {...subTree} />
      ))}
      {keys.map((key) => (
        <KeyItem key={key.storageKey} nesting={nesting + 1} {...key} />
      ))}
    </List.Accordion>
  );
}
