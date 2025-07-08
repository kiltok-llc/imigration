import * as Sentry from '@sentry/react-native';
import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import { t } from 'i18next';
import { Suspense } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { useRNSuspenseQuery } from '@/hooks/use-rn-query';
import { useTRPC } from '@/lib/trpc';
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

  const router = useRouter();
  const trpc = useTRPC();
  const {
    isPending,
    mutate: handleGenerate,
    variables,
  } = useMutation(
    trpc.document.generatePdf.mutationOptions({
      meta: {
        errorToast: 'Failed to generate PDF.',
      },
      async onSuccess({ data }) {
        const fileUri = `${FileSystem.cacheDirectory}${randomId()}.pdf`;
        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: 'base64',
        });
        router.push({
          params: {
            source: fileUri,
          },
          pathname: '/pdf-view',
        });
      },
    })
  );

  return (
    <Container style={tw`flex-1 gap-4`}>
      {documents && documents.length > 0 ? (
        documents.map((document) => (
          <Button
            disabled={isPending}
            key={document.id}
            loading={variables?.documentId === document.id && isPending}
            mode='outlined'
            onPress={() =>
              handleGenerate({
                documentId: document.id,
                variables: {},
              })
            }
            style={tw`w-full`}
          >
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

function randomId(length = 12) {
  let id = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
