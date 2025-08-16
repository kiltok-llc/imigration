import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { TransButton } from '@/components/trans';
import { OrDivider } from '@/components/ui/divider';

export function FormImageInput() {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    field: { disabled },
  } = useFormField();

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleSelect = async () => {
    await ImagePicker.launchImageLibraryAsync({});
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== 'granted') {
      toast.warning(t('permission.camera'));
      return;
    }

    await ImagePicker.launchCameraAsync({});
  };

  return (
    <View style={tw`gap-4`}>
      <TransButton
        contentStyle={tw`flex-col items-center py-14`}
        disabled={disabled}
        i18nKey='form.image.select'
        icon={({ color, size }) => (
          <Feather
            color={color}
            name='image'
            size={size * 1.2}
            style={{
              marginLeft: -16,
              marginRight: 16,
            }}
          />
        )}
        labelStyle={{
          color: theme.colors.onSurface,
        }}
        mode='outlined'
        onPress={handleSelect}
        style={tw.style('border-2', {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.primary,
        })}
      />
      <OrDivider />
      <TransButton
        contentStyle={tw`flex-row-reverse justify-between`}
        disabled={disabled}
        i18nKey='form.image.camera'
        icon={({ color, size }) => (
          <Feather color={color} name='camera' size={size} />
        )}
        onPress={handleCamera}
      />
    </View>
  );
}
