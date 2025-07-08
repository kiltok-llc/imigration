'use client';

import { PDFDocument, PDFField } from '@cantoo/pdf-lib';
import { useMutation } from '@tanstack/react-query';
import { ChevronsUpDown, SquareArrowOutUpRight, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PDFProvider, usePDF } from '@/components/document/pdf-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCurrentDocument } from '@/queries/current-document';

type PreviewData = {
  dataUri: string;
  name: string;
};

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

function AddFieldComboBox() {
  const pdf = usePDF();
  const fields = useMemo(() => pdf.getForm().getFields(), [pdf]);
  const [comboOpen, setComboOpen] = useState(false);
  const [value, setValue] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: preview, mutate: handlePreview } = useMutation({
    meta: {
      errorToast: 'Failed to open preview.',
      loadingToast: 'Loading preview...',
      successToast: 'Preview opened in new tab.',
    },
    mutationFn: async (field: PDFField) => {
      const previewPdf = await PDFDocument.create();
      const page = pdf.findPageForAnnotationRef(field.ref);
      if (!page) {
        throw new Error('Page not found for the field');
      }
      const pageIdx = pdf
        .getPages()
        .findIndex((p) => p.ref.tag === page.ref.tag);
      const [copiedPage] = await previewPdf.copyPages(pdf, [pageIdx]);
      previewPdf.addPage(copiedPage);
      const dataUri = await previewPdf.saveAsBase64({
        dataUri: true,
        updateFieldAppearances: true,
      });
      return {
        dataUri,
        name: field.getName(),
      };
    },
    onSuccess() {
      setPreviewOpen(true);
    },
  });

  return (
    <>
      <Dialog onOpenChange={setPreviewOpen} open={previewOpen}>
        <PDFDialogContent preview={preview} />
      </Dialog>
      <Popover onOpenChange={setComboOpen} open={comboOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={comboOpen}
            className={buttonVariants({
              rounded: 'lg',
              size: 'xl',
              variant: 'dashed',
            })}
            role='combobox'
            variant='outline'
          >
            {value
              ? fields.map((f) => f.getName()).find((name) => name === value)
              : 'Add field...'}
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput className='h-9' placeholder='Search fields...' />
            <CommandList>
              <CommandEmpty>Field not found.</CommandEmpty>
              <CommandGroup>
                {fields.map((field) => (
                  <CommandItem
                    key={field.getName()}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setComboOpen(false);
                    }}
                    value={field.getName()}
                  >
                    {field.getName()}
                    <Button
                      className='ml-auto'
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(field);
                      }}
                      size='icon'
                      variant='outline'
                    >
                      <SquareArrowOutUpRight />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

function GenerationFormContent() {
  return (
    <FormList name=''>
      <FormListHeader>
        <FormListTitle>Fields</FormListTitle>
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
      <AddFieldComboBox />
    </FormList>
  );
}

function PDFDialogContent({ preview }: { preview: PreviewData | undefined }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Field Preview: <span className='font-mono'>{preview?.name}</span>
        </DialogTitle>
      </DialogHeader>
      <iframe src={preview?.dataUri}>
        Your browser does not support iframes.
      </iframe>
    </DialogContent>
  );
}
