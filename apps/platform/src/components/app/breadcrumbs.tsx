'use client';

import {
  QueryKey,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import { Fragment, ReactNode, Suspense } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { dbId } from '@/lib/id';
import { titleCase } from '@/lib/utils';
import { currentDocumentQueryOptions } from '@/queries/current-document';
import { currentSurveyQueryOptions } from '@/queries/current-survey';

type BreadcrumbConfig = Record<string, ((val: string) => ReactNode) | null>;

function BreadcrumbItemQuery<Q, E, D, K extends QueryKey>({
  queryOptions,
  select,
}: {
  readonly queryOptions: UseSuspenseQueryOptions<Q, E, D, K>;
  readonly select: (data: D) => ReactNode;
}) {
  const { data } = useSuspenseQuery(queryOptions);
  return (
    <div className='lg::max-w-60 max-w-20 truncate md:max-w-40'>
      {select(data)}
    </div>
  );
}

// [
//   [ '', '${base}', '' ],
//   [ '/projects', '${base}projects/', 'projects' ],
//   [ '/projects/[projectId]', '${base}projects/98bc0369-bbb8-54d6-ae0a-776c6e323791/', '98bc0369-bbb8-54d6-ae0a-776c6e323791' ]
// ]
const useRoute = (
  base: string
): {
  href: string;
  route: string;
  segment: string;
}[] => {
  const segments = useSelectedLayoutSegments().filter(
    // filter out route groups
    (s) => !s.startsWith('(') || !s.endsWith(')')
  );
  const params = useParams<Record<string, string>>();

  // reverse the params
  const segmentsToParams = Object.fromEntries(
    Object.entries(params).map(([key, val]) => [val, `[${key}]`])
  );

  return segments.reduce(
    (acc, segment) => {
      const param = segmentsToParams[segment] as string | undefined; // TODO don't know why typescript messed this up?
      // build the route/href from the previous route/href + current param/segment
      const { href: prevHref, route: prevRoute } = acc.at(-1)!;
      const route = `${prevRoute}/${param ?? segment}`;
      const href = `${prevHref}${prevHref.endsWith('/') ? '' : '/'}${segment}`;
      return [...acc, { href, route, segment }];
    },
    [{ href: base, route: '', segment: '' }]
  );
};

// TODO fix rendering issues
export function Breadcrumbs() {
  const routes = useRoute('/');

  const breadcrumbConfig: BreadcrumbConfig = {
    '': () => <HomeIcon />,
    '/documents/[documentId]': (documentId: string) => (
      <BreadcrumbItemQuery
        queryOptions={currentDocumentQueryOptions(dbId(documentId))}
        select={(document) => document.name}
      />
    ),
    '/surveys/[surveyId]': (surveyId: string) => (
      <BreadcrumbItemQuery
        queryOptions={currentSurveyQueryOptions(dbId(surveyId))}
        select={(survey) => survey.name}
      />
    ),
  };

  const crumbs = routes
    .filter(({ route }) => breadcrumbConfig[route] !== null)
    .map(({ href, route, segment }) => ({
      crumb: breadcrumbConfig[route]?.(segment) ?? titleCase(segment),
      href,
    }));

  return (
    <Breadcrumb className='overflow-hidden px-2 whitespace-nowrap'>
      <BreadcrumbList>
        <Suspense fallback={<Skeleton size='description' />}>
          {crumbs.map(({ crumb, href }, idx) => (
            // TODO is this the right key to use?
            <Fragment key={`${href}-${idx}`}>
              {idx > 0 && <BreadcrumbSeparator key={idx} />}

              <BreadcrumbItem key={href}>
                {idx === crumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{crumb}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </Suspense>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
