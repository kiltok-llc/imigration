'use client';

import { PDFDocument, PDFField, rgb } from '@cantoo/pdf-lib';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation } from '@tanstack/react-query';
import {
  ChevronsUpDown,
  PlusIcon,
  SquareArrowOutUpRight,
  SquareArrowOutUpRightIcon,
  TrashIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import z from 'zod/v4';

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
  FormListAddButton,
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
import { ZodFormContext } from '@/lib/form';
import { useCurrentDocument } from '@/queries/current-document';

const GenerationFormSchema = z.object({
  fields: z.array(
    z.object({
      label: z.string().default(''),
      name: z.string(),
    })
  ),
});

export function GenerationFormSection() {
  const document = useCurrentDocument();

  const context: ZodFormContext<typeof GenerationFormSchema> = useForm({
    defaultValues: {
      fields: [] as { name: string }[], // TODO
    },
    resolver: standardSchemaResolver(GenerationFormSchema),
  });

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

const usePdfFields = (pdf: PDFDocument) =>
  useMemo(() => {
    const fields = new Map<string, [PDFField, number]>();
    for (const field of pdf.getForm().getFields()) {
      const page = pdf.findPageForAnnotationRef(field.ref);
      if (!page) {
        console.warn(`Field ${field.getName()} has no associated page.`);
        continue;
      }

      const idx = pdf.getPages().findIndex((p) => p.ref.tag === page.ref.tag);
      if (idx === -1) {
        console.warn(
          `Field ${field.getName()} has an invalid page index: ${idx}`
        );
        continue;
      }

      fields.set(field.getName(), [field, idx]);
    }

    return fields;
  }, [pdf]);

const usePdfPages = (pdf: PDFDocument) =>
  useMemo(() => {
    const pages = new Map<number, PDFField[]>();

    // Gather all fields by page
    for (const field of pdf.getForm().getFields()) {
      const page = pdf.findPageForAnnotationRef(field.ref)!;
      const idx = pdf.getPages().findIndex((p) => p.ref.tag === page.ref.tag);
      if (!pages.has(idx)) {
        pages.set(idx, []);
      }
      pages.get(idx)!.push(field);
    }

    return pages;
  }, [pdf]);

function GenerationFormContent() {
  const pdf = usePDF();
  const fields = usePdfFields(pdf);
  const pages = usePdfPages(pdf);

  const [comboOpen, setComboOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { getValues } = useFormContext();

  const { data: preview, mutate: handlePreview } = useMutation({
    meta: {
      errorToast: 'Failed to open preview.',
      loadingToast: 'Loading preview...',
    },
    mutationFn: async (fieldName: string) => {
      // Find the field by name
      if (!fields.has(fieldName)) {
        throw new Error(`Field ${fieldName} not found in PDF`);
      }
      const [field, page] = fields.get(fieldName)!;

      // Create Preview PDF with just the page containing our field
      const previewPdf = await PDFDocument.create();
      const [copiedPage] = await previewPdf.copyPages(pdf, [page]);
      if (!copiedPage) {
        throw new Error(`Could not copy page ${page} from PDF`);
      }
      previewPdf.addPage(copiedPage);
      await previewPdf.save();

      // Draw a box around the field
      for (const widget of field.acroField.getWidgets()) {
        const { height, width, x, y } = widget.getRectangle();
        const padding = 4;
        copiedPage.drawRectangle({
          borderColor: rgb(1, 0, 0),
          borderWidth: 2,
          height: height + padding * 2,
          width: width + padding * 2,
          x: x - padding,
          y: y - padding,
        });
      }

      // Render the preview PDF
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
      <FormList name='fields'>
        <Dialog onOpenChange={setPreviewOpen} open={previewOpen}>
          <DialogContent size='xl'>
            <DialogHeader>
              <DialogTitle>
                Field Preview:{' '}
                <span className='font-mono'>{preview?.name}</span>
              </DialogTitle>
            </DialogHeader>
            <iframe className='flex-1' src={preview?.dataUri}>
              Your browser does not support iframes.
            </iframe>
          </DialogContent>
        </Dialog>

        <FormListHeader>
          <FormListTitle>Fields</FormListTitle>
          <FormListMessage />
        </FormListHeader>
        <FormListItems>
          {(field, index, remove) => (
            <div
              className='grid grid-cols-[1fr_min-content] gap-2'
              key={field.id}
            >
              <div className='grid gap-2'>
                <FormField
                  name={`fields.${index}.name`}
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Name</FormLabel>
                      <pre className='font-mono text-sm'>{field.value}</pre>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`fields.${index}.label`}
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className='col-span-2'
                  onClick={() => {
                    handlePreview(getValues(`fields.${index}.name` as const));
                  }}
                >
                  <SquareArrowOutUpRightIcon />
                  Show Preview
                </Button>
              </div>
              <Button
                className='self-center'
                onClick={remove}
                size='icon'
                type='button'
                variant='destructive'
              >
                <TrashIcon />
              </Button>
            </div>
          )}
        </FormListItems>

        <Popover
          onOpenChange={previewOpen ? undefined : setComboOpen}
          open={comboOpen}
        >
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
              Add field...
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>

          <PopoverContent className='w-full p-0'>
            <Command>
              <CommandInput className='h-9' placeholder='Search fields...' />
              <CommandList>
                <CommandEmpty>Field not found.</CommandEmpty>
                <CommandGroup>
                  {[...pages].map(([page, fields]) => (
                    <CommandGroup heading={`Page ${page}`} key={page}>
                      {fields.map((field) => (
                        <CommandItem
                          key={field.getName()}
                          value={field.getName()}
                        >
                          {field.getName()}

                          <Button
                            className='ml-auto'
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(field.getName());
                            }}
                            size='icon'
                            variant='outline'
                          >
                            <SquareArrowOutUpRight />
                          </Button>
                          <FormListAddButton
                            value={{
                              label: field.getName(), // Default label is the name
                              name: field.getName(),
                            }}
                          >
                            <Button size='icon' variant='outline'>
                              <PlusIcon />
                            </Button>
                          </FormListAddButton>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormList>
    </>
  );
}
