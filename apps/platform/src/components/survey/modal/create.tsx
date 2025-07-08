'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
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

export const CreateSurveyFormSchema = z.object({
  description: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});

export function CreateSurveyDialog({ children }: PropsWithChildren) {
  const router = useRouter();
  const context: ZodFormContext<typeof CreateSurveyFormSchema> = useForm({
    defaultValues: {
      description: '',
      name: '',
    },
    resolver: standardSchemaResolver(CreateSurveyFormSchema),
  });

  const {
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
  } = context;

  // TODO port to cache-helpers mutations

  const handleCreate = async (
    formData: z.output<typeof CreateSurveyFormSchema>
  ) => {
    const { data: survey, error } = await supabase
      .from('surveys')
      .insert({
        description: formData.description,
        name: formData.name,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error('Failed to create survey');
      reset({}, { keepValues: true });
      return;
    }

    toast.success('Survey created!');
    router.push(`/surveys/${urlId(survey.id)}`);
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Create a new survey</TooltipContent>
      </Tooltip>

      <FormProvider {...context}>
        <DialogContent>
          <form>
            <DialogHeader>
              <DialogTitle>New Survey</DialogTitle>

              <DialogDescription>Create a new survey.</DialogDescription>
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
                onClick={handleSubmit(handleCreate)}
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
