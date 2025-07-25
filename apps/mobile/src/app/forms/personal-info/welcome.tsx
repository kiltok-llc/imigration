import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Stack, useRouter } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';

export default function Welcome() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={tw`flex-1`}>
        <Container style={tw`flex-1 items-center gap-4`}>
          <MaterialCommunityIcons
            color={theme.colors.primary}
            name='clipboard-edit-outline'
            size={96}
          />
          <Text
            style={tw.style('text-center', { color: theme.colors.primary })}
            variant='displayMedium'
          >
            <Trans i18nKey='personalInfo.welcome.title' />
          </Text>
          <Text
            style={tw.style('text-center', { color: theme.colors.primary })}
            variant='bodyLarge'
          >
            <Trans i18nKey='personalInfo.welcome.description' />
          </Text>
          <Text style={tw`text-center`} variant='bodyLarge'>
            <Trans i18nKey='personalInfo.welcome.privacyDescription' />
          </Text>
          <Button
            labelStyle={tw`text-2xl`}
            mode='contained'
            onPress={() => {
              router.push('./form');
            }}
            style={tw`mt-auto w-full`}
          >
            <Trans i18nKey='personalInfo.welcome.continue' />
          </Button>
          <Button
            labelStyle={tw`text-base text-gray-500`}
            mode='text'
            onPress={() => {
              router.push('./learn-more');
            }}
          >
            <Trans i18nKey='personalInfo.welcome.learnMore' />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}
