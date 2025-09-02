import { atom } from 'jotai';

import { PDFField } from '@/lib/services/i589/form/types';

export const a3Fields = atom<PDFField[]>((get) =>
  [...get(persecutionFields), ...get(residenceFields)].map(([k, v]) => [
    `form1[0].#subform[4].${k}`,
    v,
  ])
);

const persecutionFields = atom<PDFField[]>((_get) => [
  ['TextField13[1]', 'persecution address'],
  ['TextField13[3]', 'persecution city'],
  ['TextField13[5]', 'persecution state'],
  ['TextField13[7]', 'persecution country'],
  ['DateTimeField22[0]', 'persecution from'],
  ['DateTimeField23[0]', 'persecution to'],
]);

const residenceFields = atom<PDFField[]>((_get) => [
  ['TextField13[0]', 'previous address'],
  ['TextField13[2]', 'previous city'],
  ['TextField13[4]', 'previous state'],
  ['TextField13[6]', 'previous country'],
  ['DateTimeField21[0]', 'previous from'],
  ['DateTimeField20[0]', 'previous to'],
]);
