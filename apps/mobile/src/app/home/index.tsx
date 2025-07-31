import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import briefcaseIcon from '@/assets/icons/briefcase.png';
import calendarIcon from '@/assets/icons/calendar.png';
import familyIcon from '@/assets/icons/family.png';
import passportIcon from '@/assets/icons/passport.png';
import banner from '@/assets/onboarding/usa-banner-2.png';
import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';

const situations = {
  border: {
    href: '/i589/roadmap',
    iconSource: passportIcon,
  },
  family: {
    href: '/i589/roadmap',
    iconSource: familyIcon,
  },
  renewStatus: {
    href: '/i589/roadmap',
    iconSource: calendarIcon,
  },
  workStudy: {
    href: '/i589/roadmap',
    iconSource: briefcaseIcon,
  },
} as const;

export default function Home() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [selectedSituation, setSelectedSituation] = useState<
    keyof typeof situations | null
  >(null);

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
          title: t('situation.screenTitle'),
        }}
      />
      <View style={tw`flex-1`}>
        <Image
          alt='Banner'
          source={banner}
          style={tw.style('w-full', { aspectRatio: 4 })}
        />
        <Container style={tw`flex-1 items-center gap-4`}>
          <Text
            style={tw.style('text-center', { color: theme.colors.primary })}
            variant='displayMedium'
          >
            <Trans i18nKey='situation.whichDescribesYou' />
          </Text>
          {Object.entries(situations).map(([situation, { iconSource }]) => (
            <Button
              contentStyle={tw`h-20`}
              key={situation}
              labelStyle={tw`flex-1`}
              mode='outlined'
              onPress={() => {
                setSelectedSituation(situation as keyof typeof situations);
              }}
              style={tw.style('w-full border-2', {
                backgroundColor: theme.colors.surface,
                borderColor:
                  selectedSituation === situation
                    ? theme.colors.secondary
                    : theme.colors.surfaceDisabled,
              })}
            >
              <View
                style={tw`flex-1 flex-row items-center justify-start gap-2`}
              >
                <View style={tw``}>
                  <Image
                    contentFit='contain'
                    source={iconSource}
                    style={tw.style('flex-1', { aspectRatio: 1 })}
                  />
                </View>
                <Text
                  style={tw.style(
                    'flex-1 text-xl',
                    selectedSituation === situation && 'font-medium'
                  )}
                >
                  <Trans i18nKey={`situation.${situation}`} />
                </Text>
              </View>
            </Button>
          ))}
          <Button
            disabled={!selectedSituation}
            labelStyle={tw`text-2xl`}
            mode='contained'
            onPress={() => {
              if (selectedSituation) {
                router.push(situations[selectedSituation].href);
              }
            }}
            style={tw`mt-auto w-full`}
          >
            <Trans i18nKey='situation.next' />
          </Button>
        </Container>
      </View>
    </>
  );
}
