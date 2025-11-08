import { FontAwesome6 } from '@expo/vector-icons';
import prettyBytes from 'pretty-bytes';
import { Image, View } from 'react-native';
import {
  ActivityIndicator,
  Icon,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import tw from 'twrnc';

import { FormDocument } from '@/components/form/document';
import { TransButton, TransText } from '@/components/trans';
import { Divider } from '@/components/ui/divider';
import { Theme } from '@/lib/theme';

export function DocumentIcon({ path }: { path: string }) {
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

export function ImageInput({
  disabled,
  handlePickCamera,
  handlePickImage,
  invalid,
  isPending,
  onChange,
  value,
}: {
  disabled: boolean | undefined;
  handlePickCamera: (() => void) | undefined;
  handlePickImage: (() => void) | undefined;
  invalid: boolean;
  isPending: boolean;
  onChange: (uri: null | string) => void;
  value: null | string;
}) {
  const theme = useTheme<Theme>();
  const handleClear = () => onChange(null);

  return (
    <View
      style={tw.style('mt-2 rounded-lg border-2 border-dashed', {
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
          onPress={value == null ? handlePickImage : undefined}
          style={tw`rounded-lg`}
        >
          <View style={tw`items-center gap-2 py-2`}>
            {value != null && (
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
                value != null && 'opacity-0'
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
              style={tw.style(value != null && 'opacity-0')}
            />
          </View>
        </TouchableRipple>
        <Divider i18nKey={value == null ? 'or' : undefined} style={tw`my-3`} />
        <View style={tw`items-center`}>
          <TransButton
            contentStyle={tw.style(value == null && 'flex-row-reverse gap-2')}
            disabled={disabled}
            i18nKey={
              value == null
                ? 'form.image.camera.label'
                : 'form.image.clear.label'
            }
            icon={value == null ? 'camera' : 'trash-can'}
            mode={value == null ? 'contained' : 'contained-tonal'}
            onPress={value == null ? handlePickCamera : handleClear}
          />
        </View>
      </View>
    </View>
  );
}

export function MultiDocumentInput({
  disabled,
  handlePickDocument,
  handlePickImage,
  invalid,
  isPending,
  onChange,
  value,
}: {
  disabled: boolean | undefined;
  handlePickDocument: (() => void) | undefined;
  handlePickImage: (() => void) | undefined;
  invalid: boolean;
  isPending: boolean;
  onChange: (docs: FormDocument[]) => void;
  value: FormDocument[];
}) {
  const theme = useTheme<Theme>();

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
                onPress={handlePickDocument}
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
                onPress={handlePickImage}
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

export function SingleDocumentInput({
  disabled,
  handlePickCamera,
  handlePickDocument,
  handlePickImage,
  invalid,
  isPending,
  onChange,
  value,
}: {
  disabled: boolean | undefined;
  handlePickCamera: (() => void) | undefined;
  handlePickDocument: (() => void) | undefined;
  handlePickImage: (() => void) | undefined;
  invalid: boolean;
  isPending: boolean;
  onChange: (doc: FormDocument | null) => void;
  value: FormDocument | null;
}) {
  const theme = useTheme<Theme>();

  return (
    <View style={tw`mt-2 gap-4`}>
      <View
        style={[
          tw.style('rounded-lg border-2 border-dashed', {
            backgroundColor: theme.colors.surface,
            borderColor: invalid
              ? theme.colors.error
              : theme.colors.outlineVariant,
          }),
        ]}
      >
        {value && (
          <View
            style={tw.style('absolute inset-0', {
              backgroundColor: theme.colors.surfaceDisabled,
            })}
          >
            {value?.type?.startsWith('image/') ? (
              <Image
                resizeMode='contain'
                source={{ uri: value.uri }}
                style={tw`flex-1`}
              />
            ) : (
              <View style={tw`flex-1 items-center justify-center px-4`}>
                <DocumentIcon path={value.name} />
                <Text numberOfLines={1} style={tw`mt-4`} variant='titleMedium'>
                  {value.name}
                </Text>
                <Text numberOfLines={1} variant='bodySmall'>
                  {prettyBytes(value.size ?? 0)}
                </Text>
              </View>
            )}
            <TransButton
              i18nKey='form.document.delete.label'
              icon='trash-can-outline'
              mode='text'
              onPress={() => onChange(null)}
              shrink
              size='sm'
              style={tw`absolute top-0 right-0`}
              textColor={theme.colors.error}
            />
          </View>
        )}
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
        <View style={tw.style('p-4', (isPending || value) && 'opacity-0')}>
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
                i18nKey='form.document.description'
                style={tw`text-center`}
              />
            </View>
            <View style={tw`w-full gap-2`}>
              <TransButton
                contentStyle={tw`justify-start`}
                disabled={disabled}
                i18nKey='form.documents.camera.label'
                icon='camera'
                labelStyle={tw.style({
                  color: theme.colors.onSurface,
                })}
                mode='contained-tonal'
                onPress={handlePickCamera}
                size='sm'
              />
              <TransButton
                contentStyle={tw`justify-start`}
                disabled={disabled}
                i18nKey='form.documents.document.label'
                icon='file-document'
                labelStyle={tw.style({
                  color: theme.colors.onSurface,
                })}
                mode='contained-tonal'
                onPress={handlePickDocument}
                size='sm'
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
                onPress={handlePickImage}
                size='sm'
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
