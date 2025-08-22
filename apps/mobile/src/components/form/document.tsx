import { useMutation } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Image, View } from 'react-native';
import { ActivityIndicator, Icon, TouchableRipple, useTheme } from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { TransButton } from '@/components/trans';
import { Divider } from '@/components/ui/divider';
import { useT } from '@/hooks/use-t';
import { Theme } from '@/lib/theme';

export function FormDocumentsInput() {
  const t = useT();
  const theme = useTheme<Theme>();
  const {
    field: {disabled, onChange, value},
    fieldState: {invalid},
  } = useFormField();

  const {isPending: isPendingDocument, mutate: handlePickDocument} = useMutation({
    async mutationFn() {
      const {assets, canceled} = await DocumentPicker.getDocumentAsync({multiple: true})

      if (canceled) {
        toast.warning(t(`form.documents.cancelled`));
        return;
      }

      onChange([...value, ...assets.map((asset) => asset.uri)])
    },
  });

  const {isPending: isPendingImage, mutate: handlePickImage} = useMutation({
    async mutationFn() {
      const {assets, canceled} = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
      });

      if (canceled) {
        toast.warning(t(`form.documents.cancelled`));
        return;
      }

      onChange([...value, ...assets.map((asset) => asset.uri)]);
    },
  });

  const isPending = isPendingDocument || isPendingImage;

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
        <ActivityIndicator size='large'/>
      </View>
      <View style={[tw.style('p-4', isPending && 'opacity-0')]}>
        <View style={tw`rounded-lg`}>
          <View style={tw`items-center gap-2 py-2`}>
            <View
              style={tw.style(
                'mt-4 rounded-full p-4',
                {
                  backgroundColor: theme.colors.surfaceDisabled,
                },
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
            />
          </View>
        </View>
      </View>
    </View>
  );
}

async function requestCameraPermissions() {
  const {status} = await ImagePicker.getCameraPermissionsAsync();
  if (status === 'denied') {
    return false;
  }

  if (status !== 'granted') {
    const {granted} = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      return false;
    }
  }

  return true;
}
