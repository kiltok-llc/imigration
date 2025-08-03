import { Directory, File, Paths } from 'expo-file-system';
import { Atom, atom, useAtomValue } from 'jotai';

export const attachmentAtom = (key: string) =>
  atom<Directory>(() => {
    const directory = new Directory(
      Paths.document,
      'attachments',
      ...key.split(':')
    );
    directory.create({ idempotent: true, intermediates: true });
    return directory;
  });

export const useAttachFile = (atom: Atom<Directory>) => {
  const directory = useAtomValue(atom);
  return (file: File | null) => {
    for (const child of directory.list()) {
      child.delete();
    }

    if (file !== null) {
      file.copy(directory);
    }
  };
};
