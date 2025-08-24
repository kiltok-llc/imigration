import { View } from 'react-native';
import { Portal } from 'react-native-paper';
import tw from 'twrnc';

export function MigriOnDemand() {
  return (
    <Portal>
      <View style={tw`size-50`}></View>
    </Portal>
  );
}
