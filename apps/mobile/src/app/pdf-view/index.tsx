import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import PdfRendererView from 'react-native-pdf-renderer';
import tw from 'twrnc';

export default function PDFViewScreen() {
  const theme = useTheme();
  const { source, title } = useLocalSearchParams<{
    source: string;
    title: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          title,
        }}
      />
      <SafeAreaView style={tw`flex-1`}>
        <PdfRendererView
          distanceBetweenPages={16}
          source={source}
          style={{ backgroundColor: theme.colors.background }}
        />
      </SafeAreaView>
    </>
  );
}
