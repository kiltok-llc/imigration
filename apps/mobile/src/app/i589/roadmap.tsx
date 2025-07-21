import { Stack, useRouter } from 'expo-router';
import { t } from 'i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';

export default function Roadmap() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: t('i589.roadmap.title'),
        }}
      />
      <View style={tw`flex-1`}>
        <SafeAreaView />
        <Container style={tw`flex-1 items-center gap-4`}>
          <Button
            labelStyle={tw`text-2xl`}
            mode='contained'
            onPress={() => {
              router.push('/forms/personal-info/welcome');
            }}
            style={tw`w-full`}
          >
            <Trans i18nKey='i589.roadmap.personalInfo' />
          </Button>
        </Container>
      </View>
    </>
  );
}
