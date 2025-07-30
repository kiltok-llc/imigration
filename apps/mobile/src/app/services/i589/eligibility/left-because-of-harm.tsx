import { useRouter } from "expo-router";
import { View } from "react-native";
import {Button, Text } from "react-native-paper";

export default function LeftBecauseOfHarmScreen() {
  // const incrementPage = useSetAtom(incrementPageAtom);
  const router = useRouter();
  return (
    <View>
      <Text>Left Because of Harm</Text>
      <Button onPress={() => router.push('./physically-in-us')}>Next</Button>
    </View>
  );
}

