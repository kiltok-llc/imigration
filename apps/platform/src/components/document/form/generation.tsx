'use client';

import { TrashIcon } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

import { PDFProvider, usePDF } from '@/components/document/pdf-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  FormList,
  FormListHeader,
  FormListItems,
  FormListMessage,
  FormListTitle,
} from '@/components/ui/dynamic-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  FormSection,
  FormSectionContent,
  FormSectionHeader,
  FormSectionTitle,
} from '@/components/ui/form-layout';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrentDocument } from '@/queries/current-document';

export function GenerationFormSection() {
  const document = useCurrentDocument();

  const context = useForm();

  return (
    <FormProvider {...context}>
      <FormSection>
        <FormSectionHeader>
          <FormSectionTitle>Generation Options</FormSectionTitle>
        </FormSectionHeader>
        <FormSectionContent>
          <PDFProvider documentId={document.id}>
            <GenerationFormContent />
          </PDFProvider>
        </FormSectionContent>
      </FormSection>
    </FormProvider>
  );
}

function AddTextFieldDropdown() {
  const pdf = usePDF();

  console.log('pdf', pdf);
  console.log('pdf pages', pdf.getPages());

  return (
    <Select onValueChange={console.log}>
      <SelectTrigger
        className={buttonVariants({
          rounded: 'lg',
          size: 'xl',
          variant: 'dashed',
        })}
      >
        <SelectValue placeholder='Add field...' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='csv'>CSV file</SelectItem>
        <SelectItem value='exchange'>Exchange</SelectItem>
      </SelectContent>
    </Select>
  );
}

function GenerationFormContent() {
  return (
    <FormList name=''>
      <FormListHeader>
        <FormListTitle>Text Fields</FormListTitle>
        <FormListMessage />
      </FormListHeader>
      <FormListItems>
        {(field, index, remove) => (
          <div
            className='grid grid-cols-[1fr_1fr_min-content] gap-2 *:not-last:row-span-3 *:not-last:grid-rows-subgrid'
            key={field.id}
          >
            <FormField
              name={`launch_config.config.initialBalances.${index}.currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`launch_config.config.initialBalances.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='col-3 row-2'
              onClick={remove}
              type='button'
              variant='destructive'
            >
              <TrashIcon />
            </Button>
          </div>
        )}
      </FormListItems>
      <AddTextFieldDropdown />
    </FormList>
  );
}
