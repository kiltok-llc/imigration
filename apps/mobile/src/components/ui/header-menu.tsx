import { HeaderButton } from '@react-navigation/elements';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import {
  Children,
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Icon, Menu } from 'react-native-paper';
import uuid from 'react-native-uuid';

import { Trans } from '@/components/trans';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

const headerMenuItemsAtom = atom<ReactNode[]>([]);

const HeaderMenuContext = createRequiredContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>();

export function HeaderMenu({
  children,
  tintColor,
}: PropsWithChildren<{
  initialOpen?: boolean;
  tintColor?: string;
}>) {
  const [open, setOpen] = useState(false);
  const headerMenuItems = useAtomValue(headerMenuItemsAtom);

  if (headerMenuItems.length === 0) {
    return null;
  }

  return (
    <Menu
      anchor={
        <HeaderButton
          accessibilityLabel='Show menu'
          onPress={() => setOpen(true)}
        >
          <Icon color={tintColor} size={24} source='dots-horizontal' />
        </HeaderButton>
      }
      onDismiss={() => setOpen(false)}
      visible={open}
    >
      <HeaderMenuContext.Provider value={{ open, setOpen }}>
        {children}
        {headerMenuItems}
      </HeaderMenuContext.Provider>
    </Menu>
  );
}

export function HeaderMenuItem({
  i18nKey,
  onPress,
  ...props
}: Partial<ComponentProps<typeof Menu.Item>> & {
  i18nKey: string;
}) {
  const { setOpen } = useRequiredContext(HeaderMenuContext);

  return (
    <Menu.Item
      onPress={(e) => {
        onPress?.(e);
        setOpen(false);
      }}
      title={<Trans i18nKey={i18nKey} />}
      {...props}
    />
  );
}

export function HeaderMenuItemPortal({ children }: PropsWithChildren) {
  const setHeaderMenuItems = useSetAtom(headerMenuItemsAtom);

  useEffect(() => {
    setHeaderMenuItems((items) => [...items, children]);

    return () => {
      setHeaderMenuItems((items) => items.filter((i) => i !== children));
    };
  }, [children, setHeaderMenuItems]);

  return null;
}
