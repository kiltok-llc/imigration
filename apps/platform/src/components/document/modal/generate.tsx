'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
import { useTRPC } from '@/providers/trpc-provider';
import { CurrentDocument } from '@/queries/current-document';

export const GenerateDocumentFormSchema = z.object({
  data: z.string().transform((str, ctx): unknown => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  }),
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

  const trpc = useTRPC();

  const { mutate: handleGenerate } = useMutation(
    trpc.document.generatePdf.mutationOptions({
      onError: (error) => {
        console.error('Failed to generate document:', error);
      },
      onSettled() {
        setIsOpen(false);
      },
      onSuccess: ({ data }) => {
        const buffer = Buffer.from(data, 'base64');
        const blobUrl = URL.createObjectURL(
          new Blob([buffer], { type: 'application/pdf' })
        );
        window.open(blobUrl);
      },
    })
  );

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
                onClick={handleSubmit(({ data }) =>
                  handleGenerate({
                    documentId: document.id,
                    variables: data,
                  })
                )}
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
