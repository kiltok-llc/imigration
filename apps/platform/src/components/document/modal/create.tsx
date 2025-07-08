'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
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
import { urlId } from '@/lib/id';
import { supabase } from '@/lib/supabase/client';
import { unwrapSingle } from '@/lib/supabase/utils';

export const CreateDocumentFormSchema = z.object({
  description: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});

export function CreateDocumentDialog({ children }: PropsWithChildren) {
  const router = useRouter();
  const context: ZodFormContext<typeof CreateDocumentFormSchema> = useForm({
    defaultValues: {
      description: '',
      name: '',
    },
    resolver: standardSchemaResolver(CreateDocumentFormSchema),
  });
  const {
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
  } = context;

  const { mutateAsync: handleInsert } = useInsertMutation(
    supabase.from('documents'),
    ['id'],
    'id',
    { throwOnError: true }
  );
  const { mutateAsync: handleCreate } = useMutation({
    // Needs to appear before onError for type inference to work correctly
    onMutate() {
      const toastId = toast.loading('Creating document...');
      return { toastId };
    },

    mutationFn: async ({
      description,
      name,
    }: z.output<typeof CreateDocumentFormSchema>) =>
      handleInsert([{ description, name }]).then(unwrapSingle),
    onError(_error, _variables, context) {
      toast.error('Failed to create document', { id: context?.toastId });
    },
    onSuccess(document, _variables, { toastId }) {
      toast.success('Document created!', { id: toastId });
      router.push(`/documents/${urlId(document.id)}`);
    },
  });

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Create a new document</TooltipContent>
      </Tooltip>

      <FormProvider {...context}>
        <DialogContent>
          <form>
            <DialogHeader>
              <DialogTitle>New Document</DialogTitle>

              <DialogDescription>Create a new document.</DialogDescription>
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
                loading={isSubmitting || isSubmitSuccessful}
                onClick={handleSubmit((data) => handleCreate(data))}
                type='submit'
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
