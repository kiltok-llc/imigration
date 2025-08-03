import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';

export default function Ineligible() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('services.i589.ineligible.screenTitle'),
        }}
      />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`my-20 h-full w-full flex-1 gap-10 p-8 pt-10`}>
            <View style={tw`mb-8 items-center`}>
              <View
                style={tw`mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-500`}
              >
                <Text style={tw`text-3xl font-bold text-white`}>✗</Text>
              </View>
            </View>
            <View style={tw`gap-4`}>
              <Text style={tw`text-center font-bold`} variant='headlineMedium'>
                <Trans i18nKey='services.i589.ineligible.title' />
              </Text>
              <Text style={tw`text-center`} variant='bodyLarge'>
                <Trans i18nKey='services.i589.ineligible.description' />
              </Text>
              <Text style={tw`mt-4 text-center`} variant='bodyMedium'>
                <Trans i18nKey='services.i589.ineligible.alternatives' />
              </Text>
            </View>
          </Surface>
          <Button
            contentStyle={tw`py-1`}
            icon='arrow-left'
            labelStyle={tw`text-lg`}
            mode='contained'
            onPress={() => router.push('/services')}
            style={tw`mt-auto`}
          >
            <Trans i18nKey='services.i589.ineligible.backButton' />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}
