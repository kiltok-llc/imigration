'use client';

import dynamic from 'next/dynamic';

import { useCurrentSurvey } from '@/queries/survey';

const ClientSurveyEditor = dynamic(() => import('./client-survey-editor'), {
  ssr: false,
});

export function SurveyEditor() {
  const survey = useCurrentSurvey();
  return <ClientSurveyEditor survey={survey} />;
}
