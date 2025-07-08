'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation } from '@tanstack/react-query';
import React, { PropsWithChildren, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ZodFormContext } from '@/lib/form';
import { supabase } from '@/lib/supabase/client';
import { unwrap } from '@/lib/supabase/utils';
import { stringToJSONSchema } from '@/lib/utils';
import { CurrentDocument } from '@/queries/current-document';

export const GenerateDocumentFormSchema = z.object({
  data: stringToJSONSchema.pipe(
    z.object({
      textFields: z.record(z.string().nonempty(), z.string().optional()),
    })
  ),
});

export function GenerateDocumentDialog({
  children,
  document,
}: PropsWithChildren<{ readonly document: CurrentDocument }>) {
  const [isOpen, setIsOpen] = useState(false);
  const context: ZodFormContext<typeof GenerateDocumentFormSchema> = useForm({
    defaultValues: {
      data: '{}',
    },
    resolver: standardSchemaResolver(GenerateDocumentFormSchema),
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = context;

  const { mutateAsync: handleGenerate } = useMutation({
    // Needs to appear before onError for type inference to work correctly
    onMutate() {
      const toastId = toast.loading('Generating document...');
      return { toastId };
    },

    async mutationFn({}: z.output<typeof GenerateDocumentFormSchema>) {
      const blob = await supabase.storage
        .from('documents')
        .download(document.id)
        .then(unwrap);
      const url = URL.createObjectURL(blob);
      window.open(url);
    },
    onError(error, _, context) {
      console.error('Error generating document', error);
      toast.error('Failed to generate document.', {
        id: context?.toastId,
      });
    },
    onSettled() {
      setIsOpen(false);
    },
    onSuccess(_data, _variables, { toastId }) {
      toast.success('Generated!', {
        id: toastId,
      });
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Generate document</TooltipContent>
      </Tooltip>

      <FormProvider {...context}>
        <DialogContent>
          <form>
            <DialogHeader>
              <DialogTitle>Generate Document</DialogTitle>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <FormField
                name='data'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>

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
                onClick={handleSubmit((data) => handleGenerate(data))}
                type='submit'
              >
                Generate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
