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
import { Survey } from '@/queries/survey';

export const DuplicateSurveyFormSchema = z.object({
  description: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});

export function DuplicateSurveyDialog({
  children,
  survey,
}: PropsWithChildren<{ survey: Survey }>) {
  const [isOpen, setIsOpen] = useState(false);

  const context: ZodFormContext<typeof DuplicateSurveyFormSchema> = useForm({
    resolver: standardSchemaResolver(DuplicateSurveyFormSchema),
  });

  const {
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
  } = context;

  useEffect(() => {
    reset({
      description: `Duplicate of ${survey.name}`,
      name: `Duplicate of ${survey.name}`,
    });
  }, [survey, reset, isSubmitSuccessful]);

  // TODO port to mutations

  const handleDuplicate = async (
    formData: z.output<typeof DuplicateSurveyFormSchema>
  ) => {
    const { error } = await supabase.from('surveys').insert({
      description: formData.description,
      name: formData.name,
    });

    if (error) {
      console.error(error);
      toast.error('Failed to duplicate survey');
    }

    toast.success('Survey duplicated!');
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
              <DialogTitle>Duplicate Survey</DialogTitle>

              <DialogDescription>
                Create a duplicate of this survey.
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
