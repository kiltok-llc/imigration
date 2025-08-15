import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Drawer from 'expo-router/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import banner from '@/assets/onboarding/usa-banner-2.png';
import { TransButton, TransText } from '@/components/trans';
import { Button } from '@/components/ui/button';
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
  // const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Drawer.Screen
        options={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: theme.colors.primary,
          headerTitle: t('services.title'),
          headerTitleStyle: tw`text-2xl`,
          title: t('services.screenTitle'),
        }}
      />
      <View style={tw`flex-1`}>
        <Image source={banner} style={tw.style('w-full', { aspectRatio: 4 })} />

        <ScrollView contentContainerStyle={tw`grow-1`} style={tw`flex-1`}>
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
                  >
                    <View>
                      <TransText
                        i18nKey={`services.${id}.title`}
                        style={tw`font-semibold`}
                      />
                      <TransText
                        i18nKey={`services.${id}.subtitle`}
                        variant='bodySmall'
                      />
                    </View>
                  </Button>
                ))}
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
                {categories.map(({ href, id }) => (
                  <TransButton
                    contentStyle={tw`flex-row-reverse justify-between`}
                    i18nKey={`services.categories.${id}.title`}
                    icon='chevron-right'
                    key={id}
                    mode='outlined'
                    onPress={() => router.push(href)}
                  />
                ))}
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </>
  );
}
