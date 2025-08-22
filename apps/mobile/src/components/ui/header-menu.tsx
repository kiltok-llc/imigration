import { HeaderButton } from '@react-navigation/elements';
import * as React from 'react';
import { Children, ComponentProps, PropsWithChildren, useState } from 'react';
import { Icon, Menu } from 'react-native-paper';

import { Trans } from '@/components/trans';
import { createRequiredContext, useRequiredContext } from '@/hooks/use-required-context';

const HeaderMenuContext = createRequiredContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>();

export function HeaderMenu(
  {
    children,
    tintColor,
  }: PropsWithChildren<{
    initialOpen?: boolean;
    tintColor?: string;
  }>,
) {
  const [open, setOpen] = useState(false);

  if (Children.toArray(children).length === 0) {
    return null;
  }

  return (
    <Menu
      anchor={
        <HeaderButton
          accessibilityLabel="Show menu"
          onPress={() => setOpen(true)}
        >
          <Icon color={tintColor} size={24} source="dots-horizontal" />
        </HeaderButton>
      }
      onDismiss={() => setOpen(false)}
      visible={open}
    >
      <HeaderMenuContext.Provider value={{ open, setOpen }}>
        {children}
      </HeaderMenuContext.Provider>
    </Menu>
  );
}

export function HeaderMenuItem({
                                 i18nKey, onPress, ...props
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