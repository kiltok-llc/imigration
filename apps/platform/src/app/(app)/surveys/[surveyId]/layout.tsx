import {
  dehydrate,
  HydrationBoundary as QueryHydrationBoundary,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { PropsWithChildren, Suspense } from 'react';

import {
  SurveyShellHeader,
  SurveyShellHeaderSkeleton,
} from '@/components/survey/shell';
import { Section } from '@/components/ui/section';
import { SurveyIdProvider } from '@/lib/app-context';
import { dbId, validId } from '@/lib/id';
import { makeQueryClient } from '@/lib/query';
import { surveyQueryOptions } from '@/queries/survey';

export default async function SurveyLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ surveyId: string }>;
}>) {
  const { surveyId } = await params;

  // handle invalid uuid early
  if (!validId(surveyId, true)) {
    notFound();
  }

  const queryClient = makeQueryClient();
  void queryClient.prefetchQuery(surveyQueryOptions(dbId(surveyId)));

  return (
    <QueryHydrationBoundary state={dehydrate(queryClient)}>
      <SurveyIdProvider value={dbId(surveyId)}>
        <Section size='xs'>
          <Suspense fallback={<SurveyShellHeaderSkeleton />}>
            <SurveyShellHeader />
          </Suspense>
        </Section>

        {children}
      </SurveyIdProvider>
    </QueryHydrationBoundary>
  );
}
