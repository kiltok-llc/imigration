'use client';

import { ProviderProps } from 'react';

import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

const UserIdContext = createRequiredContext<string>();
export const useUserId = () => useRequiredContext(UserIdContext);

export function UserIdProvider(props: ProviderProps<string>) {
  return <UserIdContext.Provider {...props} />;
}

const SurveyIdContext = createRequiredContext<string>();
export const useSurveyId = () => useRequiredContext(SurveyIdContext);

export function SurveyIdProvider(props: ProviderProps<string>) {
  return <SurveyIdContext.Provider {...props} />;
}

const DocumentIdContext = createRequiredContext<string>();
export const useDocumentId = () => useRequiredContext(DocumentIdContext);

export function DocumentIdProvider(props: ProviderProps<string>) {
  return <DocumentIdContext.Provider {...props} />;
}
