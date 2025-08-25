import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Stack, useNavigation, useRouter } from 'expo-router';
import * as React from 'react';
import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import banner from '@/assets/onboarding/usa-banner-2.png';
import { DrawerToggleButton } from '@/components/drawer';
import { MigriButton } from '@/components/migri/migri-button';
import { MigriTrigger } from '@/components/migri/migri-trigger';
import { TransButton, TransText } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { useT } from '@/hooks/use-t';

export default function Services() {
  const t = useT();
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: ({ tintColor }) => (
            <DrawerToggleButton navigation={navigation} tintColor={tintColor} />
          ),
          headerShadowVisible: false,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: tw`text-2xl`,
          title: t('services.screenTitle'),
        }}
      />

      <MigriTrigger id='services.welcome' type='talk' />

      <View style={tw`flex-1`}>
        <Image source={banner} style={tw.style('w-full', { aspectRatio: 4 })} />
        <ScrollView
          contentContainerStyle={tw`grow-1`}
          scrollsToTop={false}
          style={tw`flex-1`}
        >
          <SafeAreaView
            edges={{ bottom: 'maximum' }}
            style={tw`flex-1 gap-8 p-4`}
          >
            {/*<Searchbar*/}
            {/*  onChangeText={setSearchQuery}*/}
            {/*  placeholder={t('services.searchPlaceholder')}*/}
            {/*  value={searchQuery}*/}
            {/*/>*/}

            <View style={tw`gap-2`}>
              <TransText
                i18nKey='services.popular'
                style={tw.style('font-bold', {
                  color: theme.colors.primary,
                })}
                variant='headlineSmall'
              />
              <View style={tw`gap-2`}>
                <PopularServiceButton
                  icon={(props) => (
                    <FontAwesome6 name='person-shelter' {...props} />
                  )}
                  id='i589'
                />
                <PopularServiceButton
                  icon={(props) => <FontAwesome6 name='passport' {...props} />}
                  id='b2'
                />
                <PopularServiceButton
                  icon={(props) => (
                    <FontAwesome6 name='clipboard-list' {...props} />
                  )}
                  id='i765'
                />
              </View>
            </View>

            <View style={tw`gap-2`}>
              <TransText
                i18nKey='services.categories.title'
                style={tw.style('font-bold', {
                  color: theme.colors.primary,
                })}
                variant='headlineSmall'
              />
              <View style={tw`gap-2`}>
                <CategoryButton id='residency' />
                <CategoryButton id='work' />
                <CategoryButton id='family' />
                <CategoryButton id='education' />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>

        <MigriButton float id='services.welcome' />
      </View>
    </>
  );
}

function CategoryButton({ id }: { id: string }) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <TransButton
      buttonColor={theme.colors.surface}
      contentStyle={tw`flex-row-reverse justify-between`}
      i18nKey={`services.categories.${id}.title`}
      icon='chevron-right'
      key={id}
      mode='outlined'
      onPress={() => router.navigate(`/services/categories/${id}`)}
      textColor={theme.colors.onSurface}
    />
  );
}

function PopularServiceButton({
  icon,
  id,
}: {
  icon: (props: { color: string; size: number }) => ReactNode;
  id: string;
}) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Button
      buttonColor={theme.colors.surface}
      contentStyle={tw`flex-row-reverse`}
      icon='chevron-right'
      labelStyle={tw`flex-1`}
      mode='outlined'
      onPress={() => router.navigate(`/services/${id}`)}
    >
      <View style={tw`flex-row items-center justify-start gap-2`}>
        <View style={tw`w-9 items-center justify-center`}>
          {icon({ color: theme.colors.primary, size: 36 })}
        </View>
        <View style={tw`flex-1`}>
          <TransText
            i18nKey={`services.${id}.title`}
            style={tw`font-semibold`}
          />
          <TransText i18nKey={`services.${id}.subtitle`} variant='bodySmall' />
        </View>
      </View>
    </Button>
  );
}
