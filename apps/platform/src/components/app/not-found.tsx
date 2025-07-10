import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { twc } from 'react-twc';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { H1, P } from '@/components/ui/typography';
import { titleCase } from '@/lib/utils';

export const NotFoundContent = twc(Container)`flex flex-col items-start gap-4`;

export const NotFoundCaption = twc(P)`text-primary`;

export const NotFoundTitle = twc(H1)``;

export const NotFoundDescription = twc(P)`text-muted-foreground`;

export const notFoundMetadata = {
  title: '404',
};

export function EntityNotFoundPage({
  entity,
  href,
}: {
  entity: string;
  href: string;
}) {
  return (
    <Section center viewport>
      <NotFoundContent>
        <NotFoundCaption>404</NotFoundCaption>

        <NotFoundTitle>{titleCase(entity)} not found</NotFoundTitle>

        <NotFoundDescription>
          Sorry, we couldn&apos;t find the {entity} you&apos;re looking for.
        </NotFoundDescription>

        <Button asChild>
          <Link href={href}>
            <ChevronLeftIcon />
            Back to all {entity}s
          </Link>
        </Button>
      </NotFoundContent>
    </Section>
  );
}
