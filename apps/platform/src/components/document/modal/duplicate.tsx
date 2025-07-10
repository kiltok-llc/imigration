'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ZodFormContext } from '@/lib/form';
import { supabase } from '@/lib/supabase/client';
import { Document } from '@/queries/document';

export const DuplicateDocumentFormSchema = z.object({
  description: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});

export function DuplicateDocumentDialog({
  children,
  document,
}: PropsWithChildren<{ document: Document }>) {
  const [isOpen, setIsOpen] = useState(false);

  const context: ZodFormContext<typeof DuplicateDocumentFormSchema> = useForm({
    resolver: standardSchemaResolver(DuplicateDocumentFormSchema),
  });

  const {
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
  } = context;

  useEffect(() => {
    reset({
      description: `Duplicate of ${document.name}`,
      name: `Duplicate of ${document.name}`,
    });
  }, [document, reset, isSubmitSuccessful]);

  const handleDuplicate = async (
    formData: z.output<typeof DuplicateDocumentFormSchema>
  ) => {
    const { error } = await supabase.from('documents').insert({
      description: formData.description,
      name: formData.name,
    });

    if (error) {
      console.error(error);
      toast.error('Failed to duplicate document');
    }

    toast.success('Document duplicated!');
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Duplicate</TooltipContent>
      </Tooltip>

      <FormProvider {...context}>
        <DialogContent>
          <form>
            <DialogHeader>
              <DialogTitle>Duplicate Document</DialogTitle>

              <DialogDescription>
                Create a duplicate of this document.
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <FormField
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                loading={isSubmitting}
                onClick={handleSubmit(handleDuplicate)}
                type='submit'
              >
                Duplicate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
