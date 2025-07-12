import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { File, Paths } from 'expo-file-system/next';
import { Stack, useRouter } from 'expo-router';
import { t } from 'i18next';
import { Suspense } from 'react';
import { View } from 'react-native';
import { useMMKVObject } from 'react-native-mmkv';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Container } from '@/components/ui/container';
import { useSuspenseQuery } from '@/hooks/use-rn-query';
import { storage } from '@/lib/mmkv';
import { useTRPC } from '@/lib/trpc';
import { Documents, documentsQueryOptions } from '@/queries/documents';

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
          <DocumentList />
        </Suspense>
      </View>
    </>
  );
}

function DocumentList() {
  const { data: documents } = useSuspenseQuery(documentsQueryOptions());
  const trpc = useTRPC();
  const router = useRouter();

  const [userData] = useMMKVObject('userData', storage);

  const { mutateAsync: generatePdf } = useMutation(
    trpc.pdf.generate.mutationOptions()
  );

  const { mutate: handleOpenDocument } = useMutation({
    meta: {
      errorToast: 'Failed to open document',
      loadingToast: 'Opening...',
    },
    async mutationFn(document: Documents[number]) {
      const data = await generatePdf({
        documentId: document.id,
        variables: userData,
      });

      const outFile = new File(Paths.cache, `${document.id}.pdf`);
      await FileSystem.writeAsStringAsync(outFile.uri, data, {
        encoding: 'base64',
      });

      router.push({
        params: {
          source: outFile.uri,
          title: document.name,
        },
        pathname: '/pdf-view',
      });
    },
  });

  return (
    <Container style={tw`flex-1 gap-4`}>
      {documents && documents.length > 0 ? (
        documents.map((document) => (
          <Button
            key={document.id}
            mode='outlined'
            onPress={() => handleOpenDocument(document)}
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
