import { atom } from 'jotai';

import { PDFField } from '@/lib/services/i589/form/types';

export const interviewFieldsAtom = atom<PDFField[]>((_get) =>
  [
    ['CheckBox32[0]', true], // all true
    ['TextField27[2]', 'client signature'], // Client signature
    ['DateTimeField49[0]', new Date()], // signature date
    ['TextField27[1]', 'native alphabet name'], // Native alphabet name
  ].map(([k, v]) => [`form1[0].#subform[11].${k}`, v])
);
