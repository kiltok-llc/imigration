import { HeaderButton } from '@react-navigation/elements';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Icon, Menu } from 'react-native-paper';

export function HeaderMenu({
  children,
  open,
  setOpen,
  tintColor,
}: PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
  tintColor?: string;
}>) {
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
      {children}
    </Menu>
  );
}
