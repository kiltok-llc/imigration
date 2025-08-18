import { File, Paths } from 'expo-file-system/next';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Icon, TouchableRipple, useTheme } from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';

import { useFormField } from '@/components/form/field';
import { TransButton } from '@/components/trans';
import { OrDivider } from '@/components/ui/divider';

export function FormImageInput({ directory = '' }: { directory?: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    field: { disabled },
  } = useFormField();

  const handleSelect = async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({});
    if (canceled || !assets?.[0]) {
      toast.warning(t('form.image.select.cancelled'));
      return;
    }

    const capturedImage = new File(assets[0].uri);
    const savedImage = new File(
      Paths.document,
      directory,
      `${uuidv4()}${capturedImage.extension}`
    );
    console.log(savedImage);
  };

  const handleCamera = async () => {
    const granted = await requestCameraPermissions();
    if (!granted) {
      toast.error(t('permission.camera.denied'));
      return;
    }

    const { assets, canceled } = await ImagePicker.launchCameraAsync({});
    if (canceled || !assets?.[0]) {
      toast.warning(t('form.image.camera.cancelled'));
      return;
    }
  };

  return (
    <View
      style={tw.style('mx-4 gap-4 rounded-lg border-2 border-dashed p-4', {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.outlineVariant,
      })}
    >
      <TouchableRipple
        borderless
        onPress={() => void handleSelect()}
        style={tw`rounded-lg`}
      >
        <View style={tw`items-center gap-2`}>
          <View
            style={tw.style('mt-4 rounded-full p-4', {
              backgroundColor: theme.colors.surfaceDisabled,
            })}
          >
            <Icon
              color={theme.colors.onSurface}
              size={36}
              source='file-image'
            />
          </View>
          <TransButton
            disabled={disabled}
            i18nKey='form.image.select.label'
            mode='text'
          />
        </View>
      </TouchableRipple>
      <OrDivider />
      <View style={tw`items-center`}>
        <TransButton
          contentStyle={tw`flex-row-reverse gap-2`}
          disabled={disabled}
          i18nKey='form.image.camera.label'
          icon='camera'
          onPress={handleCamera}
          style={tw`my-2`}
        />
      </View>
    </View>
  );
}

async function requestCameraPermissions() {
  const { status } = await ImagePicker.getCameraPermissionsAsync();
  if (status === 'denied') {
    return false;
  }

  if (status !== 'granted') {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      return false;
    }
  }

  return true;
}
