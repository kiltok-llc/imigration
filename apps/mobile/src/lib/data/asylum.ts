import z from 'zod/v4';

import { atomWithMMKVZod } from '@/atoms/atom-with-mmkv-zod';
import { defaultStorage } from '@/lib/mmkv';

export const lateApplicationDetailsAtom = atomWithMMKVZod(
  'late-application-details',
  '',
  z.string(),
  defaultStorage
);

export const harmDetailsAtom = atomWithMMKVZod(
  'harm-details',
  '',
  z.string(),
  defaultStorage
);

export const fearDetailsAtom = atomWithMMKVZod(
  'fear-details',
  '',
  z.string(),
  defaultStorage
);

export const fearOfTortureDetailsAtom = atomWithMMKVZod(
  'fear-of-torture-details',
  '',
  z.string(),
  defaultStorage
);

export const internationalCriminalHistoryDetailsAtom = atomWithMMKVZod(
  'international-criminal-history-details',
  '',
  z.string(),
  defaultStorage
);

export const pastOrganizationalAffiliationsDetailsAtom = atomWithMMKVZod(
  'past-organizational-affiliations-details',
  '',
  z.string(),
  defaultStorage
);

export const currentOrganizationalAffiliationsDetailsAtom = atomWithMMKVZod(
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

export const reasonsForAsylumAtom = atomWithMMKVZod(
  'reasons-for-asylum',
  [],
  z.array(AsylumReasonEnum),
  defaultStorage
);

export const hasPreviousApplicationsAtom = atomWithMMKVZod(
  'has-previous-applications',
  null,
  z.boolean().nullable(),
  defaultStorage
);

export const previousApplicationDetailsAtom = atomWithMMKVZod(
  'previous-application-details',
  '',
  z.string(),
  defaultStorage
);

export const internationalImmigrationHistoryDetailsAtom = atomWithMMKVZod(
  'international-immigration-history-details',
  '',
  z.string(),
  defaultStorage
);

export const harmParticipationDetailsAtom = atomWithMMKVZod(
  'harm-participation-details',
  '',
  z.string(),
  defaultStorage
);

export const returnToCountryDetailsAtom = atomWithMMKVZod(
  'return-to-country-details',
  '',
  z.string(),
  defaultStorage
);

export const criminalHistoryDetailsAtom = atomWithMMKVZod(
  'criminal-history-details',
  '',
  z.string(),
  defaultStorage
);

export const criminalHistoryDocuments = atomWithMMKVZod(
  'criminal-history-documents',
  [],
  z.array(z.string()),
  defaultStorage
);

export const criminalHistoryDocumentDetailsAtom = atomWithMMKVZod(
  'criminal-history-document-details',
  '',
  z.string(),
  defaultStorage
);
