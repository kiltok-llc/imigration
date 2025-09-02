import { atom } from 'jotai';

import { AsylumReasonEnum } from '@/lib/data/asylum';
import { PDFField } from '@/lib/services/i589/form/types';

export const applicationFields = atom<PDFField[]>((get) => [
  ...get(page1),
  ...get(page2),
  ...get(page3),
]);

const page1 = atom<PDFField[]>((get) =>
  [
    ...get(asylumReasonFields),

    [`ckboxyn1a[1]`, true], // No harm or persecution
    [`ckboxyn1a[0]`, true], // Yes harm or persecution
    [`TextField14[0]`, 'harm or persecution details'],

    [`ckboxyn1b[1]`, true], // No harm if return to country
    [`ckboxyn1b[0]`, true], // Yes harm if return to country
    [`TextField15[0]`, 'harm if return to country details'],
  ].map(([k, v]) => [`form1[0].#subform[5].#subform[6].${k}`, v])
);

const asylumReasonFields = atom<PDFField[]>((_get) =>
  AsylumReasonEnum.options.map((reason) => [`CheckBox${reason}[0]`, true])
);

const page2 = atom<PDFField[]>((_get) =>
  [
    [`ckboxyn2[1]`, true], // No international criminal history
    [`ckboxyn2[0]`, true], // Yes international criminal history
    [`PBL2_TextField[0]`, 'international criminal history details'],

    [`ckboxyn3a[1]`, true], // No past organizational affiliations
    [`ckboxyn3a[0]`, true], // Yes past organizational affiliations
    [`PBL3A_TextField[0]`, 'past organizational affiliations details'],

    [`ckboxyn3b[1]`, true], // No current organizational affiliations
    [`ckboxyn3b[0]`, true], // Yes current organizational affiliations
    [`PBL3B_TextField[0]`, 'current organizational affiliations details'],

    [`ckboxyn4[1]`, true], // No fear of torture
    [`ckboxyn4[0]`, true], // Yes fear of torture
    [`PB4_TextField[0]`, 'fear of torture details'],
  ].map(([k, v]) => [`form1[0].#subform[7].${k}`, v])
);

const page3 = atom<PDFField[]>((_get) =>
  [
    [`ckboxync1[1]`, true], // No previous asylum applications
    [`ckboxync1[0]`, true], // Yes previous asylum applications
    [`PCL1_TextField[0]`, 'previous asylum applications details'],

    [`ckboxync2a[1]`, true], // No travel through or reside other countries
    [`ckboxync2a[0]`, true], // Yes travel through or reside other countries
    [`ckboxync2b[1]`, true], // No apply or receive status other countries
    [`ckboxync2b[0]`, true], // Yes apply or receive status other countries
    [`PCL2B_TextField[0]`, 'other countries details'],

    [`ckboxync3[1]`, true], // No participate in persecution
    [`ckboxync3[0]`, true], // Yes participate in persecution
    [`PCL3_TextField[0]`, 'participate in persecution details'],
  ].map(([k, v]) => [`form1[0].#subform[8].${k}`, v])
);
