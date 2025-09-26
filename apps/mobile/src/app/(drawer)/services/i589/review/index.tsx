import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';
import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import PdfRendererView from 'react-native-pdf-renderer';
import tw from 'twrnc';

import { MigriButton } from '@/components/migri/migri-talk-button';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { i589PdfAtom } from '@/lib/services/i589/form/pdf';
import { useT } from '@/lib/translation';

export default function Review() {
  const t = useT();
  const service = useService();
  const step = useStep();
  const { data: pdf, status } = useAtomValue(i589PdfAtom);

  return (
    <>
      <Stack.Screen
        options={{
          title: t(`services.${service}.${step}.screenTitle`),
        }}
      />
      <View style={tw`flex-1`}>
        {status === 'success' && (
          <PdfRendererView distanceBetweenPages={16} maxZoom={8} source={pdf} />
        )}
        {status === 'pending' && (
          <ActivityIndicator
            size='large'
            style={tw`flex-1 items-center justify-center`}
          />
        )}
        <MigriButton
          id={`services.${service}.review`}
          style={tw`absolute right-6 bottom-6`}
        />
      </View>
    </>
  );
}
