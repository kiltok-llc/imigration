import { Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'react-native-paper';
import PdfRendererView from 'react-native-pdf-renderer';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function PDFModal() {
  const theme = useTheme();
  const { source, title } = useLocalSearchParams<{
    source: string;
    title: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
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
