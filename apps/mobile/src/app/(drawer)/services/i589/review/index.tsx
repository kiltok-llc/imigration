import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';
import * as React from 'react';
import { Suspense } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import PdfRendererView from 'react-native-pdf-renderer';
import tw from 'twrnc';

import { MigriButton } from '@/components/migri/migri-button';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { i589PdfAtom } from '@/lib/services/i589/pdf';
import { useT } from '@/lib/translation';

export function I589PDF() {
  const pdf = useAtomValue(i589PdfAtom);
  return <PdfRendererView distanceBetweenPages={16} maxZoom={8} source={pdf} />;
}

export default function Review() {
  const t = useT();
  const service = useService();
  const step = useStep();

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${service}.${step}.screenTitle`),
        }}
      />
      <View style={tw`flex-1`}>
        <Suspense
          fallback={
            <ActivityIndicator
              size='large'
              style={tw`flex-1 items-center justify-center`}
            />
          }
        >
          <I589PDF />
        </Suspense>
        <MigriButton
          id={`services.${service}.review`}
          style={tw`absolute bottom-6 right-6`}
        />
      </View>
    </>
  );
}
