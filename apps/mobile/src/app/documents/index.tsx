import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import { t } from 'i18next';
import { Suspense } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { useRNSuspenseQuery } from '@/hooks/use-rn-query';
import { documentsQueryOptions } from '@/queries/documents';

// interface StoredDocument {
//   title: string;
//   uri: string;
// }

export default function DocumentsScreen() {
  const theme = useTheme();
  // const [documents] = useMMKVObject<StoredDocument[]>('documents');

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTitleStyle: { color: theme.colors.onPrimary },
          title: t('documents.screenTitle'),
        }}
      />
      <View style={tw`flex-1`}>
        <Suspense
          fallback={
            <View style={tw`flex-1 items-center justify-center`}>
              <ActivityIndicator size='large' />
            </View>
          }
        >
          <Button
            onPress={() => {
              Sentry.captureException(new Error('First error'));
            }}
          >
            Try!
          </Button>
          <DocumentList />
        </Suspense>
      </View>
    </>
  );
}

function DocumentList() {
  const { data: documents } = useRNSuspenseQuery(documentsQueryOptions());

  return (
    <Container style={tw`flex-1 gap-4`}>
      {documents && documents.length > 0 ? (
        documents.map((document) => (
          <Button disabled key={document.id} mode='outlined' style={tw`w-full`}>
            {document.name}
          </Button>
        ))
      ) : (
        <Text style={tw`text-center text-lg`}>
          <Trans i18nKey='documents.noneMessage' />
        </Text>
      )}
    </Container>
  );
}
