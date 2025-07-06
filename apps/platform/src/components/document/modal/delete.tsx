'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase/client';
import { CurrentDocument } from '@/queries/current-document';

export function DeleteDocumentDialog({
  children,
  document,
}: PropsWithChildren<{ readonly document: CurrentDocument }>) {
  const router = useRouter();
  const context = useForm();
  const {
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
  } = context;

  const handleDelete = async () => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id);

    if (error) {
      console.error(error);
      toast.error('Failed to delete document');
    }

    toast.success('Deleted document!');
    router.replace('/documents');
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Delete</TooltipContent>
      </Tooltip>

      <FormProvider {...context}>
        <DialogContent>
          <form>
            <DialogHeader>
              <DialogTitle>Delete {document.name}</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this document? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                loading={isSubmitting || isSubmitSuccessful}
                onClick={handleSubmit(handleDelete)}
                type='submit'
                variant='destructive'
              >
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
