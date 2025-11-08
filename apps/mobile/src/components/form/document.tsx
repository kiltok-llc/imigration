import { useMutation } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';
import z from 'zod/v4';

import { useFormField } from '@/components/form/field';
import {
  ImageInput,
  MultiDocumentInput,
  SingleDocumentInput,
} from '@/components/ui/document';
import { useT } from '@/lib/translation';

export const FormDocumentSchema = z.object({
  name: z.string(),
  size: z.number().optional(),
  type: z.string(),
  uri: z.string(),
});

export type FormDocument = z.infer<typeof FormDocumentSchema>;

export type PickDocumentType = 'camera' | 'document' | 'library';

export async function launchNativePicker(
  type: PickDocumentType,
  multiple: boolean,
  dataUri: boolean = false
): Promise<FormDocument[]> {
  switch (type) {
    case 'camera':
    case 'library': {
      const opts: ImagePicker.ImagePickerOptions = {
        allowsMultipleSelection: multiple,
        base64: dataUri,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        quality: 0.8,
      };
      const { assets, canceled } =
        type === 'camera'
          ? await ImagePicker.launchCameraAsync(opts)
          : await ImagePicker.launchImageLibraryAsync(opts);

      if (canceled) {
        return [];
      }

      return assets.map(({ base64, fileName, mimeType, uri }) => ({
        name: fileName ?? new File(uri).name,
        type: mimeType ?? 'application/octet-stream',
        uri: dataUri ? `data:image/jpeg;base64,${base64}` : uri,
      }));
    }
    case 'document': {
      const { assets, canceled } = await DocumentPicker.getDocumentAsync({
        base64: dataUri,
        multiple,
      });

      if (canceled) {
        return [];
      }

      return assets.map(
        ({ mimeType = 'application/octet-stream', name, size, uri }) => ({
          name,
          size,
          type: mimeType,
          uri: dataUri
            ? `data:${mimeType};base64,${new File(uri).base64Sync()}`
            : uri,
        })
      );
    }
  }
}

export const usePickMutation = () => {
  const t = useT();

  return useMutation({
    meta: {
      errorToastKey: 'form.documents.error',
    },
    mutationFn: async ({
      dataUri = false,
      multiple = false,
      type,
    }: {
      dataUri?: boolean;
      multiple?: boolean;
      type: PickDocumentType;
    }) => {
      if (type === 'camera') {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) {
          toast.error(t(`permission.${type}.denied`));
          return [];
        }
      }

      const documents = await launchNativePicker(type, multiple, dataUri);

      if (documents.length === 0) {
        toast.warning(t(`form.documents.cancelled`));
      }

      return documents;
    },
  });
};

export function FormDocumentInput({ dataUri }: { dataUri?: boolean }) {
  const {
    field: { disabled, onChange, value },
    fieldState: { invalid },
  } = useFormField();

  const { isPending, mutate: pickDocument } = usePickMutation();
  const handlePick = (type: PickDocumentType) =>
    pickDocument(
      { dataUri, type },
      {
        onSuccess: (docs) => onChange(docs[0] ?? null),
      }
    );

  return (
    <SingleDocumentInput
      disabled={disabled}
      handlePickCamera={() => handlePick('camera')}
      handlePickDocument={() => handlePick('document')}
      handlePickImage={() => handlePick('library')}
      invalid={invalid}
      isPending={isPending}
      onChange={onChange}
      value={value}
    />
  );
}

export function FormImageInput() {
  const {
    field: { disabled, onChange, value },
    fieldState: { invalid },
  } = useFormField();

  const { isPending, mutate: pickDocument } = usePickMutation();
  const handlePick = (type: PickDocumentType) =>
    pickDocument(
      { type },
      {
        onSuccess: (docs) => onChange(docs[0]?.uri ?? null),
      }
    );

  return (
    <ImageInput
      disabled={disabled}
      handlePickCamera={() => handlePick('camera')}
      handlePickImage={() => handlePick('library')}
      invalid={invalid}
      isPending={isPending}
      onChange={onChange}
      value={value}
    />
  );
}

export function FormMultiDocumentInput() {
  const {
    field: { disabled, onChange, value },
    fieldState: { invalid },
  } = useFormField();

  const { isPending, mutate: pickDocument } = usePickMutation();
  const handlePick = (type: PickDocumentType) =>
    pickDocument(
      { multiple: true, type },
      {
        onSuccess: (docs) => onChange([...value, ...docs]),
      }
    );

  return (
    <MultiDocumentInput
      disabled={disabled}
      handlePickDocument={() => handlePick('document')}
      handlePickImage={() => handlePick('library')}
      invalid={invalid}
      isPending={isPending}
      onChange={onChange}
      value={value}
    />
  );
}
