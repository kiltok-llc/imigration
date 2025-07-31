import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useNextRouteName } from '@/providers/route-sequence';

export default function ArrivalDate() {
  const nextRouteName = useNextRouteName();
  const router = useRouter();

  return (
    <View>
      <Text>Arrival Date</Text>
      <Button onPress={() => router.push(`./${nextRouteName}`)}>Next</Button>
    </View>
  );
}

