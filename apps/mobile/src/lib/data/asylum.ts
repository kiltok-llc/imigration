import z from 'zod/v4';

import { userDataDocumentAtom } from '@/lib/data/utils';

export const lateApplicationDetailsAtom = userDataDocumentAtom(
  'late-application-details',
  '',
  z.string()
);

export const harmDetailsAtom = userDataDocumentAtom(
  'harm-details',
  '',
  z.string()
);

export const fearDetailsAtom = userDataDocumentAtom(
  'fear-details',
  '',
  z.string()
);

export const fearOfTortureDetailsAtom = userDataDocumentAtom(
  'fear-of-torture-details',
  '',
  z.string()
);

export const internationalCriminalHistoryDetailsAtom = userDataDocumentAtom(
  'international-criminal-history-details',
  '',
  z.string()
);

export const pastOrganizationalAffiliationsDetailsAtom = userDataDocumentAtom(
  'past-organizational-affiliations-details',
  '',
  z.string()
);

export const currentOrganizationalAffiliationsDetailsAtom =
  userDataDocumentAtom(
    'current-organizational-affiliations-details',
    '',
    z.string()
  );

export const AsylumReasonEnum = z.enum([
  'political',
  'religious',
  'nationality',
  'race',
  'political-opinion',
  'social-group',
  'torture',
]);

export const reasonsForSeekingAsylumAtom = userDataDocumentAtom(
  'reasons-for-seeking-asylum',
  null,
  z.array(AsylumReasonEnum).nullable()
);

export const hasPreviouslyAppliedForAsylumAtom = userDataDocumentAtom(
  'has-previously-applied-for-asylum',
  null,
  z.boolean().nullable()
);

export const previousApplicationDetailsAtom = userDataDocumentAtom(
  'previous-application-details',
  '',
  z.string()
);

export const internationalImmigrationHistoryDetailsAtom = userDataDocumentAtom(
  'international-immigration-history-details',
  '',
  z.string()
);

export const harmParticipationDetailsAtom = userDataDocumentAtom(
  'harm-participation-details',
  '',
  z.string()
);

export const returnToCountryDetailsAtom = userDataDocumentAtom(
  'return-to-country-details',
  '',
  z.string()
);

export const criminalHistoryDetailsAtom = userDataDocumentAtom(
  'criminal-history-details',
  '',
  z.string()
);

export const criminalHistoryDocuments = userDataDocumentAtom(
  'criminal-history-documents',
  [],
  z.array(z.string())
);

export const criminalHistoryDocumentDetailsAtom = userDataDocumentAtom(
  'criminal-history-document-details',
  '',
  z.string()
);
