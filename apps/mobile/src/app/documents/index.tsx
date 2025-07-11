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
import { useSuspenseQuery } from '@/hooks/use-rn-query';
import { supabase } from '@/lib/supabase/client';
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
  const router = useRouter();

  const { mutate: handleOpenDocument } = useMutation({
    meta: {
      errorToast: 'Failed to open document',
      loadingToast: 'Opening...',
    },
    async mutationFn(document: Documents[number]) {
      const path = `${document.id}.pdf`;
      const {
        data: { publicUrl },
      } = supabase.storage.from('documents').getPublicUrl(path);
      const { uri } = await FileSystem.downloadAsync(
        publicUrl,
        FileSystem.cacheDirectory + path
      );
      router.push({
        params: {
          source: uri,
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
