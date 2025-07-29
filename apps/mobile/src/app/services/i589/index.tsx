import { Stack } from 'expo-router';
import { Button, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';

export default function I589() {
  return (
    <>
      <Stack.Screen options={{
        title: 'screens.services.i589.progress.screenTitle',
      }} />
      <SafeAreaView edges={['right', 'bottom', 'left']} style={tw`flex-1`}>
        <Container>
          <Surface style={tw`flex-1 p-2 my-20 w-full h-full`}>
            <Text variant="bodyLarge">
              <Trans i18nKey="services.services.i589.steps.${stepId}.title" />
            </Text>
          </Surface>
          <Button mode="contained" onPress={() => {}} style={tw`mt-auto`}>
            <Trans i18nKey="next" />
          </Button>
        </Container>
      </SafeAreaView>
    </>
  );
}
