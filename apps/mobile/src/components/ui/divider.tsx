import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import tw from 'twrnc';

import { TransText } from '@/components/trans';

export function OrDivider() {
  return (
    <View style={tw`flex-row items-center`}>
      <Divider style={tw`flex-1`} />
      <TransText i18nKey='or' style={tw`mx-2`} />
      <Divider style={tw`flex-1`} />
    </View>
  );
}
