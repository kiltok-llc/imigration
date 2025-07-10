'use client';

import { ChevronRightIcon, FilePlusIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { BrandSpinner } from '@/components/brand/logo';
import { CreateDocumentDialog } from '@/components/document/modal/create';
import InfiniteFetcher from '@/components/infinite-scroller';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  EmptyContainer,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowTrigger,
} from '@/components/ui/table';
import { H3 } from '@/components/ui/typography';
import { urlId } from '@/lib/id';
import { DocumentsInfinite, useInfiniteDocuments } from '@/queries/documents';

export function DocumentList() {
  const {
    data: documents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDocuments();

  if (documents.length === 0) {
    return <DocumentListEmpty />;
  }
  return (
    <Container>
      <Table borderVariant='rounded'>
        <TableHeader>
          <HeaderRow />
        </TableHeader>

        <TableBody>
          {documents.map((document) => (
            <DocumentRow document={document} key={document.id} />
          ))}

          {isFetchingNextPage ? (
            <TableRow hover={false} key={0}>
              <TableCell colSpan={99}>
                <BrandSpinner />
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <InfiniteFetcher
        count={documents.length}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Container>
  );
}

export function DocumentListHeader() {
  return (
    <Container className='flex justify-between'>
      <H3>Documents</H3>

      <CreateDocumentDialog>
        <Button size='icon'>
          <PlusIcon />
        </Button>
      </CreateDocumentDialog>
    </Container>
  );
}

export function DocumentListHeaderSkeleton() {
  return (
    <Container className='flex justify-between'>
      <H3>Documents</H3>

      <Skeleton size='title' />
    </Container>
  );
}

export function DocumentListSkeleton() {
  return (
    <Container>
      <Table borderVariant='rounded'>
        <TableHeader>
          <HeaderRow />
        </TableHeader>

        <TableBody>
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRow className='h-12' hover={false} key={i}>
              <TableCell>
                <Skeleton size='description' />
              </TableCell>

              <TableCell colSpan={99}>
                <Skeleton className='ml-auto' size='label' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

function DocumentListEmpty() {
  return (
    <EmptyContainer>
      <FilePlusIcon />

      <EmptyTitle>No documents</EmptyTitle>

      <EmptyDescription>
        Get started by creating a new document.
      </EmptyDescription>
    </EmptyContainer>
  );
}

function DocumentRow({ document }: { document: DocumentsInfinite[number] }) {
  return (
    <TableRow>
      <TableCell>{document.name}</TableCell>

      <TableCell>{document.description}</TableCell>

      <TableCell>
        {new Date(document.updatedAt).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </TableCell>

      <TableCell className='text-right'>
        <ChevronRightIcon className='text-muted-foreground size-4 flex-none' />

        <TableRowTrigger>
          <Link href={`/documents/${urlId(document.id)}`} />
        </TableRowTrigger>
      </TableCell>
    </TableRow>
  );
}

function HeaderRow() {
  return (
    <TableRow>
      <TableHead>Name</TableHead>

      <TableHead>Description</TableHead>

      <TableHead>Last Updated</TableHead>

      <TableHead className='w-6' />
    </TableRow>
  );
}
