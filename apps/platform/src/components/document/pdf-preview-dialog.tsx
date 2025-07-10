import { PropsWithChildren } from 'react';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function PDFPreviewDialogContent({
  children,
  src,
}: PropsWithChildren<{
  src: string | undefined;
}>) {
  return (
    <DialogContent size='full'>
      <DialogHeader>
        <DialogTitle>{children}</DialogTitle>
      </DialogHeader>
      <iframe className='flex-1' src={src}>
        Your browser does not support iframes.
      </iframe>
    </DialogContent>
  );
}
