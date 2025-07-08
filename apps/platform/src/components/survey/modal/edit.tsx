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
import { CurrentSurvey } from '@/queries/current-survey';

export const EditSurveyFormSchema = z.object({
  description: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});

export function EditSurveyDialog({
  children,
  survey,
}: PropsWithChildren<{ readonly survey: CurrentSurvey }>) {
  const [isOpen, setIsOpen] = useState(false);
  const context: ZodFormContext<typeof EditSurveyFormSchema> = useForm({
    resolver: standardSchemaResolver(EditSurveyFormSchema),
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = context;

  useEffect(() => {
    reset(
      {
        description: survey.description,
        name: survey.name,
      },
      { keepDirtyValues: true }
    );
  }, [reset, survey]);

  // TODO port to cache-helpers mutations

  const handleEdit = async (
    formData: z.output<typeof EditSurveyFormSchema>
  ) => {
    const { error } = await supabase.from('surveys').update({
      description: formData.description,
      name: formData.name,
    });

    if (error) {
      console.error(error);
      toast.error('Failed to edit survey');
    }

    toast.success('Saved!');
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Edit details</TooltipContent>
      </Tooltip>

      <FormProvider {...context}>
        <DialogContent>
          <form>
            <DialogHeader>
              <DialogTitle>Edit Survey</DialogTitle>
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
                onClick={handleSubmit(handleEdit)}
                type='submit'
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
