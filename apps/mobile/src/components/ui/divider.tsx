import { View, ViewStyle } from 'react-native';
import { Divider as PaperDivider } from 'react-native-paper';
import tw from 'twrnc';

import { TransText } from '@/components/trans';

export function Divider({
  i18nKey,
  style,
}: {
  i18nKey?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[tw`h-5 flex-row items-center`, style]}>
      <PaperDivider style={tw`flex-1`} />
      {i18nKey && (
        <>
          <TransText i18nKey={i18nKey} style={tw`mx-2`} />
          <PaperDivider style={tw`flex-1`} />
        </>
      )}
    </View>
  );
}
