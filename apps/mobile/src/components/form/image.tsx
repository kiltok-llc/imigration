import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import {
  ActivityIndicator,
  Icon,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { TransButton } from '@/components/trans';
import { Divider } from '@/components/ui/divider';
import { Theme } from '@/lib/theme';

export function FormImageInput() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const {
    field: { disabled, onChange, value },
    fieldState: { invalid },
  } = useFormField();

  const { isPending, mutate: handlePickImage } = useMutation({
    async mutationFn(type: 'camera' | 'library') {
      if (type === 'camera') {
        const granted = await requestCameraPermissions();
        if (!granted) {
          toast.error(t('permission.camera.denied'));
          return;
        }
      }

      const { assets, canceled } =
        type === 'camera'
          ? await ImagePicker.launchCameraAsync({})
          : await ImagePicker.launchImageLibraryAsync({});

      if (canceled || !assets?.[0]) {
        toast.warning(t(`form.image.${type}.cancelled`));
        return;
      }

      onChange(assets[0].uri);
    },
  });

  const hasValue = value != null;

  const handleLibrary = () => handlePickImage('library');
  const handleCamera = () => handlePickImage('camera');
  const handleClear = () => onChange(null);

  return (
    <View
      style={tw.style('mx-4 rounded-lg border-2 border-dashed', {
        backgroundColor: theme.colors.surface,
        borderColor: invalid ? theme.colors.error : theme.colors.outlineVariant,
      })}
    >
      <View
        style={[
          tw.style(
            'absolute inset-0 items-center justify-center',
            !isPending && 'opacity-0'
          ),
        ]}
      >
        <ActivityIndicator size='large' />
      </View>
      <View style={[tw.style('p-4', isPending && 'opacity-0')]}>
        <TouchableRipple
          borderless
          disabled={disabled}
          onPress={hasValue ? undefined : handleLibrary}
          style={tw`rounded-lg`}
        >
          <View style={tw`items-center gap-2 py-2`}>
            {hasValue && (
              <Image
                resizeMode='contain'
                source={{ uri: value }}
                style={tw.style('absolute inset-0', {
                  backgroundColor: theme.colors.surfaceDisabled,
                })}
              />
            )}
            <View
              style={tw.style(
                'mt-4 rounded-full p-4',
                {
                  backgroundColor: theme.colors.surfaceDisabled,
                },
                hasValue && 'opacity-0'
              )}
            >
              <Icon
                color={theme.colors.onSurface}
                size={36}
                source='file-image'
              />
            </View>
            <TransButton
              disabled={disabled}
              i18nKey='form.image.library.label'
              labelStyle={{
                color: theme.colors.onSurface,
              }}
              mode='text'
              style={tw.style(hasValue && 'opacity-0')}
            />
          </View>
        </TouchableRipple>
        <Divider i18nKey={hasValue ? undefined : 'or'} style={tw`my-3`} />
        <View style={tw`items-center`}>
          <TransButton
            contentStyle={tw.style(!hasValue && 'flex-row-reverse gap-2')}
            disabled={disabled}
            i18nKey={
              hasValue ? 'form.image.clear.label' : 'form.image.camera.label'
            }
            icon={hasValue ? 'trash-can' : 'camera'}
            mode={hasValue ? 'contained-tonal' : 'contained'}
            onPress={hasValue ? handleClear : handleCamera}
          />
        </View>
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
