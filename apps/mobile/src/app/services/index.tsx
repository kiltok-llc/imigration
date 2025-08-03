import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Button, Searchbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import banner from '@/assets/onboarding/usa-banner-2.png';
import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { IconProps } from '@/lib/icon-props';

const popularServices = [
  {
    href: '/services/b2',
    Icon: (props: IconProps) => <FontAwesome6 name='passport' {...props} />,
    id: 'b2',
  },
  {
    href: '/services/i589',
    Icon: (props: IconProps) => (
      <FontAwesome6 name='person-shelter' {...props} />
    ),
    id: 'i589',
  },
  {
    href: '/services/i765',
    Icon: (props: IconProps) => (
      <FontAwesome6 name='clipboard-list' {...props} />
    ),
    id: 'i765',
  },
];

// Define categories
const categories = [
  { href: '/services/categories/residency', id: 'residency' },
  { href: '/services/categories/work', id: 'work' },
  { href: '/services/categories/family', id: 'family' },
  { href: '/services/categories/education', id: 'education' },
];

export default function Services() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: t('services.screenTitle'),
        }}
      />
      <SafeAreaView edges={['top', 'right', 'left']} style={tw`flex-1`}>
        <Image source={banner} style={tw.style('w-full', { aspectRatio: 4 })} />
        <Text
          style={tw.style('pb-4 text-center font-bold', {
            color: theme.colors.primary,
          })}
          variant='displaySmall'
        >
          YEET
          <Trans i18nKey='services.title' />
        </Text>

        <ScrollView
          contentContainerStyle={tw`grow-1 gap-8 pt-4`}
          style={tw`flex-1`}
        >
          <SafeAreaView edges={['bottom']} style={tw`flex-1`}>
            <Container style={tw`flex-1 gap-8`}>
              <Searchbar
                onChangeText={setSearchQuery}
                placeholder={t('services.searchPlaceholder')}
                value={searchQuery}
              />

              <View style={tw`gap-2`}>
                <Text
                  style={tw.style('font-bold', {
                    color: theme.colors.primary,
                  })}
                  variant='headlineSmall'
                >
                  <Trans i18nKey='services.popular' />
                </Text>
                <View style={tw`gap-2`}>
                  {popularServices.map(({ href, Icon, id }) => (
                    <Button
                      contentStyle={tw`justify-start gap-2`}
                      icon={(props) => (
                        <View style={tw`w-9 items-center justify-center`}>
                          <Icon {...props} size={36} />
                        </View>
                      )}
                      key={id}
                      mode='outlined'
                      onPress={() => router.push(href)}
                      style={tw.style('w-full')}
                    >
                      <View style={tw``}>
                        <Text style={tw.style('font-semibold', {})}>
                          <Trans i18nKey={`services.${id}.title`} />
                        </Text>
                        <Text style={tw.style('')} variant='bodySmall'>
                          <Trans i18nKey={`services.${id}.subtitle`} />
                        </Text>
                      </View>
                    </Button>
                  ))}
                </View>
              </View>

              <View style={tw`gap-2`}>
                <Text
                  style={tw.style('font-bold', {
                    color: theme.colors.primary,
                  })}
                  variant='headlineSmall'
                >
                  <Trans i18nKey='services.categories.title' />
                </Text>
                <View style={tw`gap-2`}>
                  {categories.map(({ href, id }) => (
                    <Button
                      contentStyle={tw`flex-row-reverse justify-between`}
                      icon='chevron-right'
                      key={id}
                      mode='outlined'
                      onPress={() => router.push(href)}
                      style={tw.style('w-full')}
                    >
                      <Trans i18nKey={`services.categories.${id}.title`} />
                    </Button>
                  ))}
                </View>
              </View>
            </Container>
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
