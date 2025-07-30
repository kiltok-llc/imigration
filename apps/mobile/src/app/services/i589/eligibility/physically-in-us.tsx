import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function PhysicallyInUSScreen() {
  // const incrementPage = useSetAtom(incrementPageAtom);
  const router = useRouter();
  return (
    <View>
      <Text>Physically in US</Text>
      <Button onPress={() => router.push('./left-because-of-harm')}>Next</Button>
    </View>
  );
}

