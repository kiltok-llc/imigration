import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { HeaderButton } from '@react-navigation/elements';
import {
  CommonActions,
  DrawerActions,
  ParamListBase,
} from '@react-navigation/native';
import { Drawer as ExpoDrawer } from 'expo-router/drawer';
import * as React from 'react';
import { ComponentProps } from 'react';
import { Image, View } from 'react-native';
import { Drawer as PaperDrawer, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import stars from '@/assets/drawer/stars.png';
import toggleDrawerIcon from '@/assets/drawer/toggle-drawer-icon.png';
import { env } from '@/env';

export function Drawer({
  screenOptions,
  ...props
}: ComponentProps<typeof ExpoDrawer>) {
  const theme = useTheme();

  return (
    <ExpoDrawer
      drawerContent={(props) => (
        <View style={tw`flex-1`}>
          <DrawerContentScrollView alwaysBounceVertical={false} {...props}>
            <Image
              source={stars}
              style={tw.style('mx-auto mb-8 h-20', { aspectRatio: 8 / 3 })}
            />
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
          {env.EXPO_PUBLIC_APP_VARIANT !== 'production' && (
            <SafeAreaView edges={{ bottom: 'maximum' }} style={tw`p-2`}>
              <Text style={tw`font-mono`}>
                iMigration {env.EXPO_PUBLIC_APP_VARIANT}
              </Text>
              <Text style={tw`font-mono`}>
                Build ID: {env.EXPO_PUBLIC_BUILD_ID}
              </Text>
              <Text style={tw`font-mono`}>
                Commit Hash: {env.EXPO_PUBLIC_COMMIT_HASH}
              </Text>
            </SafeAreaView>
          )}
        </View>
      )}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        ...screenOptions,
      }}
      {...props}
    />
  );
}

export function DrawerToggleButton({
  navigation,
  tintColor,
}: {
  navigation: DrawerNavigationProp<ParamListBase>;
  tintColor?: string;
}) {
  return (
    <HeaderButton
      accessibilityLabel='Show navigation enu'
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={tw`px-0`}
    >
      <Image
        fadeDuration={0}
        resizeMode='contain'
        source={toggleDrawerIcon}
        style={tw`size-6`}
        tintColor={tintColor}
      />
    </HeaderButton>
  );
}

function DrawerItemList({
  descriptors,
  navigation,
  state,
}: DrawerContentComponentProps) {
  const theme = useTheme();

  return (
    <PaperDrawer.Section showDivider={false} style={tw`gap-2`}>
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
            theme={{
              fonts: {
                labelLarge: {
                  fontSize: theme.fonts.titleMedium.fontSize,
                },
              },
            }}
          />
        );
      })}
    </PaperDrawer.Section>
  );
}
