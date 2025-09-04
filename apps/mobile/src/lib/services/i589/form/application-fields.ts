import { atom } from 'jotai';

import {
  AsylumReasonEnum,
  criminalHistoryDetailsAtom,
  currentOrganizationalAffiliationsDetailsAtom,
  fearOfTortureDetailsAtom,
  harmParticipationDetailsAtom,
  internationalCriminalHistoryDetailsAtom,
  internationalImmigrationHistoryDetailsAtom,
  lateApplicationDetailsAtom,
  pastOrganizationalAffiliationsDetailsAtom,
  previousApplicationDetailsAtom,
  returnToCountryDetailsAtom,
} from '@/lib/data/asylum';
import { PDFField } from '@/lib/services/i589/form/types';

export const applicationFieldsAtom = atom<PDFField[]>((get) => [
  ...get(page1FieldsAtom),
  ...get(page2FieldsAtom),
  ...get(page3FieldsAtom),
  ...get(page4FieldsAtom),
]);

const page1FieldsAtom = atom<PDFField[]>((get) =>
  [
    ...get(asylumReasonFieldsAtom),

    ['ckboxyn1a[1]', true], // No harm or persecution
    ['ckboxyn1a[0]', true], // Yes harm or persecution
    ['TextField14[0]', 'harm or persecution details'],

    ['ckboxyn1b[1]', true], // No harm if return to country
    ['ckboxyn1b[0]', true], // Yes harm if return to country
    ['TextField15[0]', 'harm if return to country details'],
  ].map(([k, v]) => [`form1[0].#subform[5].#subform[6].${k}`, v])
);

const asylumReasonFieldsAtom = atom<PDFField[]>((_get) =>
  AsylumReasonEnum.options.map((reason) => [`CheckBox${reason}[0]`, true])
);

const page2FieldsAtom = atom<PDFField[]>((get) =>
  [
    ['ckboxyn2[1]', !get(internationalCriminalHistoryDetailsAtom)],
    ['ckboxyn2[0]', !!get(internationalCriminalHistoryDetailsAtom)],
    ['PBL2_TextField[0]', get(internationalCriminalHistoryDetailsAtom)],

    ['ckboxyn3a[1]', !get(pastOrganizationalAffiliationsDetailsAtom)],
    ['ckboxyn3a[0]', !!get(pastOrganizationalAffiliationsDetailsAtom)],
    ['PBL3A_TextField[0]', get(pastOrganizationalAffiliationsDetailsAtom)],

    ['ckboxyn3b[1]', !get(currentOrganizationalAffiliationsDetailsAtom)],
    ['ckboxyn3b[0]', !!get(currentOrganizationalAffiliationsDetailsAtom)],
    ['PBL3B_TextField[0]', get(currentOrganizationalAffiliationsDetailsAtom)],

    ['ckboxyn4[1]', !get(fearOfTortureDetailsAtom)], // No fear of torture
    ['ckboxyn4[0]', !!get(fearOfTortureDetailsAtom)], // Yes fear of torture
    ['PB4_TextField[0]', get(fearOfTortureDetailsAtom)],
  ].map(([k, v]) => [`form1[0].#subform[7].${k}`, v])
);

const page3FieldsAtom = atom<PDFField[]>((get) =>
  [
    ['ckboxync1[1]', !get(previousApplicationDetailsAtom)],
    ['ckboxync1[0]', !!get(previousApplicationDetailsAtom)],
    ['PCL1_TextField[0]', get(previousApplicationDetailsAtom)],

    // TODO travel through other countries
    ['ckboxync2a[1]', true], // No travel through or reside other countries
    ['ckboxync2a[0]', false], // Yes travel through or reside other countries

    ['ckboxync2b[1]', !get(internationalImmigrationHistoryDetailsAtom)],
    ['ckboxync2b[0]', !!get(internationalImmigrationHistoryDetailsAtom)],
    ['PCL2B_TextField[0]', get(internationalImmigrationHistoryDetailsAtom)],

    ['ckboxync3[1]', !get(harmParticipationDetailsAtom)],
    ['ckboxync3[0]', !!get(harmParticipationDetailsAtom)],
    ['PCL3_TextField[0]', get(harmParticipationDetailsAtom)],
  ].map(([k, v]) => [`form1[0].#subform[8].${k}`, v])
);

const page4FieldsAtom = atom<PDFField[]>((get) =>
  [
    ['PCckboxyn4[1]', !get(returnToCountryDetailsAtom)],
    ['PCckboxyn4[0]', !!get(returnToCountryDetailsAtom)],
    ['PCL4_TextField[0]', get(returnToCountryDetailsAtom)],

    ['ckboxync5[1]', !get(lateApplicationDetailsAtom)],
    ['ckboxync5[0]', !!get(lateApplicationDetailsAtom)],
    ['PCL5_TextField[0]', get(lateApplicationDetailsAtom)],

    ['ckboxync6[1]', !get(criminalHistoryDetailsAtom)],
    ['ckboxync6[0]', !!get(criminalHistoryDetailsAtom)],
    ['PCL6_TextField[0]', get(criminalHistoryDetailsAtom)],
  ].map(([k, v]) => [`form1[0].#subform[9].${k}`, v])
);
