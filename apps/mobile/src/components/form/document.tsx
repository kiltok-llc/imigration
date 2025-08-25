import { FontAwesome6 } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import prettyBytes from 'pretty-bytes';
import { View } from 'react-native';
import {
  ActivityIndicator,
  Icon,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';
import z from 'zod/v4';

import { useFormField } from '@/components/form/field';
import { TransButton, TransText } from '@/components/trans';
import { Theme } from '@/lib/theme';
import { useT } from '@/lib/translation';

export const FormDocumentSchema = z.object({
  name: z.string().nullable(),
  size: z.number().nullable(),
  uri: z.string(),
});

export type FormDocument = z.infer<typeof FormDocumentSchema>;

export function FormDocumentsInput() {
  const t = useT();
  const theme = useTheme<Theme>();
  const {
    field: { disabled, onChange, value },
    fieldState: { invalid },
  } = useFormField();

  const { isPending: isPendingDocument, mutate: handlePickDocument } =
    useMutation({
      async mutationFn() {
        const { assets, canceled } = await DocumentPicker.getDocumentAsync({
          multiple: true,
        });

        if (canceled) {
          toast.warning(t(`form.documents.cancelled`));
          return;
        }

        onChange([
          ...value,
          ...assets.map((asset) => ({
            name: asset.name,
            size: asset.size ?? null,
            uri: asset.uri,
          })),
        ]);
      },
    });

  const { isPending: isPendingImage, mutate: handlePickImage } = useMutation({
    async mutationFn() {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
      });

      if (canceled) {
        toast.warning(t(`form.documents.cancelled`));
        return;
      }

      onChange([
        ...value,
        ...assets.map((asset) => ({
          name: asset.fileName ?? null,
          size: asset.fileSize ?? null,
          uri: asset.uri,
        })),
      ]);
    },
  });

  const isPending = isPendingDocument || isPendingImage;

  return (
    <View style={tw`mt-2 gap-4`}>
      <View
        style={[
          tw.style(
            'rounded-lg border-2 border-dashed p-4',
            {
              backgroundColor: theme.colors.surface,
              borderColor: invalid
                ? theme.colors.error
                : theme.colors.outlineVariant,
            },
            isPending && 'opacity-0'
          ),
        ]}
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
        <View>
          <View style={tw`items-center gap-6 py-2`}>
            <View
              style={tw.style('rounded-full p-4', {
                backgroundColor: theme.colors.surfaceDisabled,
              })}
            >
              <Icon
                color={theme.colors.onSurface}
                size={36}
                source='file-plus'
              />
            </View>
            <View style={tw`gap-2`}>
              <TransText
                i18nKey='form.documents.title'
                style={tw`text-center`}
                variant='titleMedium'
              />
              <TransText
                i18nKey='form.documents.description'
                style={tw`text-center`}
              />
            </View>
            <View style={tw`w-full gap-2`}>
              <TransButton
                contentStyle={tw`justify-start`}
                disabled={disabled}
                i18nKey='form.documents.document.label'
                icon='file-document'
                labelStyle={tw.style({
                  color: theme.colors.onSurface,
                })}
                mode='contained-tonal'
                onPress={() => handlePickDocument()}
              />
              <TransButton
                contentStyle={tw`justify-start`}
                disabled={disabled}
                i18nKey='form.documents.library.label'
                icon='image'
                labelStyle={{
                  color: theme.colors.onSurface,
                }}
                mode='contained-tonal'
                onPress={() => handlePickImage()}
              />
            </View>
          </View>
        </View>
      </View>

      {value?.map(({ name, size, uri }: FormDocument) => (
        <View
          key={uri}
          style={tw.style('flex-row rounded-lg border px-3 py-2', {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          })}
        >
          <View style={tw`justify-center pr-2`}>
            <DocumentIcon path={name ?? uri} />
          </View>
          <View style={tw`flex-1 justify-center`}>
            <Text numberOfLines={1} variant='titleSmall'>
              {name}
            </Text>
            <Text numberOfLines={1} variant='bodySmall'>
              {prettyBytes(size ?? 0)}
            </Text>
          </View>
          <View>
            <IconButton
              icon='trash-can-outline'
              iconColor={theme.colors.error}
              onPress={() =>
                onChange(value.filter((doc: FormDocument) => doc.uri !== uri))
              }
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function DocumentIcon({ path }: { path: string }) {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const icon =
    {
      aac: 'file-audio',
      avi: 'file-video',
      csv: 'file-csv',
      doc: 'file-word',
      docx: 'file-word',
      gz: 'file-zipper',
      jpeg: 'file-image',
      jpg: 'file-image',
      mkv: 'file-video',
      mov: 'file-video',
      mp3: 'file-audio',
      mp4: 'file-video',
      pdf: 'file-pdf',
      png: 'file-image',
      ppt: 'file-powerpoint',
      pptx: 'file-powerpoint',
      rar: 'file-zipper',
      txt: 'file-document',
      wav: 'file-audio',
      xls: 'file-excel',
      xlsx: 'file-excel',
      zip: 'file-zipper',
    }[ext] ?? 'file-circle-question';
  return <FontAwesome6 color='black' name={icon} size={36} />;
}
