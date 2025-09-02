import { atom } from 'jotai';

import { PDFField } from '@/lib/services/i589/form/types';

export const hearingFields = atom<PDFField[]>((_get) =>
  [
    ['PG_CheckBox[0]', true], // all true
    ['TextField27[5]', 'client signature'], // Client signature
    ['DateTimeField50[0]', new Date()], // signature date
    ['TextField27[4]', 'native alphabet name'], // Native alphabet name
  ].map(([k, v]) => [`form1[0].#subform[11].${k}`, v])
);
