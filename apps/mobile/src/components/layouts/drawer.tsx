import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Drawer as ExpoDrawer } from 'expo-router/drawer';
import * as React from 'react';
import { Drawer as PaperDrawer, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import stars from '@/assets/stars.png';

export function Drawer() {
  const theme = useTheme();

  return (
    <ExpoDrawer
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <Image
              source={stars}
              style={tw.style('mx-auto mb-8 h-20', { aspectRatio: 8 / 3 })}
            />
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        );
      }}
      screenOptions={{
        drawerHideStatusBarOnOpen: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    />
  );
}

export function DrawerItemList({
  descriptors,
  navigation,
  state,
}: DrawerContentComponentProps) {
  return (
    <PaperDrawer.Section showDivider={false}>
      {state.routes.map((route, i) => {
        const focused = i === state.index;

        const onPress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'drawerItemPress',
          });

          if (!event.defaultPrevented) {
            navigation.dispatch({
              ...(focused
                ? DrawerActions.closeDrawer()
                : CommonActions.navigate(route)),
              target: state.key,
            });
          }
        };

        const { drawerIcon, drawerItemStyle, drawerLabel, title } =
          descriptors[route.key]!.options;

        const label =
          drawerLabel === undefined
            ? title === undefined
              ? route.name
              : title
            : drawerLabel;

        if (typeof label !== 'string') {
          throw new TypeError(
            `DrawerItemList: drawerLabel must be a string, received ${typeof label}`
          );
        }

        return (
          <PaperDrawer.Item
            accessibilityLabel={label}
            active={focused}
            icon={({ color, size }) => drawerIcon?.({ color, focused, size })}
            key={route.key}
            label={label}
            onPress={onPress}
            style={drawerItemStyle}
          />
        );
      })}
    </PaperDrawer.Section>
  );
}
