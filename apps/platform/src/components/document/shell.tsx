'use client';

import { CopyIcon, EditIcon, TrashIcon } from 'lucide-react';

import { DeleteDocumentDialog } from '@/components/document/modal/delete';
import { DuplicateDocumentDialog } from '@/components/document/modal/duplicate';
import { EditDocumentDialog } from '@/components/document/modal/edit';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';
import { H3, Muted } from '@/components/ui/typography';
import { useCurrentDocument } from '@/queries/document';

export function DocumentShellHeader() {
  const document = useCurrentDocument();

  return (
    <Container className='flex flex-row justify-between gap-8' size='full'>
      <div>
        <H3>{document.name}</H3>

        <Muted>{document.description}</Muted>
      </div>

      <div className='flex flex-row gap-2'>
        <EditDocumentDialog document={document}>
          <Button size='icon'>
            <EditIcon />
          </Button>
        </EditDocumentDialog>

        <DuplicateDocumentDialog document={document}>
          <Button size='icon'>
            <CopyIcon />
          </Button>
        </DuplicateDocumentDialog>

        <DeleteDocumentDialog document={document}>
          <Button size='icon' variant='destructive'>
            <TrashIcon />
          </Button>
        </DeleteDocumentDialog>
      </div>
    </Container>
  );
}

export function DocumentShellHeaderSkeleton() {
  return (
    <Container className='flex flex-row justify-between gap-8' size='full'>
      <div>
        <Skeleton size='title' />

        <Skeleton size='description' />
      </div>
    </Container>
  );
}
