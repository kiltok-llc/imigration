import { atom } from 'jotai';

import { PDFField } from '@/lib/services/i589/form/types';

export const supplementBFieldsAtom = atom<PDFField[][]>(() => [[], [], []]);
