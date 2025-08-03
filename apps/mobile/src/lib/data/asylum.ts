import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const lateApplicationDetailsAtom = atomWithMmkvStorage(
  'late-application-details',
  '',
  z.string(),
  defaultStorage
);

export const harmDetailsAtom = atomWithMmkvStorage(
  'harm-details',
  '',
  z.string(),
  defaultStorage
);

export const fearDetailsAtom = atomWithMmkvStorage(
  'fear-details',
  '',
  z.string(),
  defaultStorage
);

export const fearOfTortureDetailsAtom = atomWithMmkvStorage(
  'fear-of-torture-details',
  '',
  z.string(),
  defaultStorage
);

export const internationalCriminalHistoryDetailsAtom = atomWithMmkvStorage(
  'international-criminal-history-details',
  '',
  z.string(),
  defaultStorage
);

export const pastOrganizationalAffiliationsDetailsAtom = atomWithMmkvStorage(
  'past-organizational-affiliations-details',
  '',
  z.string(),
  defaultStorage
);

export const currentOrganizationalAffiliationsDetailsAtom = atomWithMmkvStorage(
  'current-organizational-affiliations-details',
  '',
  z.string(),
  defaultStorage
);

export const AsylumReasonEnum = z.enum([
  'race',
  'religion',
  'nationality',
  'politics',
  'social',
  'torture',
]);

export const reasonsForAsylumAtom = atomWithMmkvStorage(
  'reasons-for-asylum',
  [],
  z.array(AsylumReasonEnum),
  defaultStorage
);

export const hasPreviousApplicationsAtom = atomWithMmkvStorage(
  'has-previous-applications',
  null,
  z.boolean().nullable(),
  defaultStorage
);

export const previousApplicationDetailsAtom = atomWithMmkvStorage(
  'previous-application-details',
  '',
  z.string(),
  defaultStorage
);

export const internationalImmigrationHistoryDetailsAtom = atomWithMmkvStorage(
  'international-immigration-history-details',
  '',
  z.string(),
  defaultStorage
);

export const harmParticipationDetailsAtom = atomWithMmkvStorage(
  'harm-participation-details',
  '',
  z.string(),
  defaultStorage
);

export const returnToCountryDetailsAtom = atomWithMmkvStorage(
  'return-to-country-details',
  '',
  z.string(),
  defaultStorage
);

export const criminalHistoryDetailsAtom = atomWithMmkvStorage(
  'criminal-history-details',
  '',
  z.string(),
  defaultStorage
);

export const criminalHistoryDocuments = atomWithMmkvStorage(
  'criminal-history-documents',
  [],
  z.array(z.string()),
  defaultStorage
);

export const criminalHistoryDocumentDetailsAtom = atomWithMmkvStorage(
  'criminal-history-document-details',
  '',
  z.string(),
  defaultStorage
);
