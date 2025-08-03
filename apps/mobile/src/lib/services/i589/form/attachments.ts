import { Directory, File } from 'expo-file-system';
import { atom } from 'jotai';

import { birthCertificateAttachmentAtom } from '@/lib/data/user';

export type Attachment = Directory | File;

export const attachmentsAtom = atom<Attachment[]>((get) => [
  ...get(birthCertificateAttachmentAtom).list(),
]);
