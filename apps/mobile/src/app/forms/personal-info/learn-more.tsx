import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';

export default function LearnMore() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: t('personalInfo.learnMore.screenTitle'),
        }}
      />
      <SafeAreaView style={tw`flex-1`}>
        <Container style={tw`flex-1 items-center gap-4`}>
          <Text
            style={tw.style('text-center', { color: theme.colors.primary })}
            variant='displayMedium'
          >
            <Trans i18nKey='personalInfo.learnMore.title' />
          </Text>
          <Text style={tw`text-center`} variant='bodyLarge'>
            <Trans i18nKey='personalInfo.learnMore.content' />
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <MaterialIcons color={theme.colors.primary} name='lock' size={32} />
            <Text style={tw`flex-1 text-center`} variant='bodyLarge'>
              <Trans i18nKey='personalInfo.learnMore.privacyContent' />
            </Text>
          </View>
          <Button
            labelStyle={tw`text-2xl`}
            mode='contained'
            onPress={() => {
              router.replace('./form');
            }}
            style={tw`mt-auto w-full`}
          >
            <Trans i18nKey='personalInfo.learnMore.continue' />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}
