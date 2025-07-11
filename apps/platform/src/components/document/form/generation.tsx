'use client';

import {
  PDFButton,
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFField,
  PDFOptionList,
  PDFRadioGroup,
  PDFSignature,
  PDFTextField,
  rgb,
} from '@cantoo/pdf-lib';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import jsonata from 'jsonata';
import {
  ChevronsUpDown,
  EqualIcon,
  PlusIcon,
  SquareArrowOutUpRight,
  SquareArrowOutUpRightIcon,
  TrashIcon,
} from 'lucide-react';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
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
  FormError,
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
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { ZodFormContext } from '@/lib/form';
import {
  FieldType,
  FieldTypeSchema,
  GeneratedFieldsSchema,
} from '@/lib/schema/documents';
import { supabase } from '@/lib/supabase/client';
import { titleCase } from '@/lib/utils';
import { useCurrentDocument } from '@/queries/document';

const SampleDataContext =
  createRequiredContext<[string, (data: string) => void, boolean]>();

function SampleDataFormContent() {
  const [sampleData, setSampleData, isValidSampleData] =
    useRequiredContext(SampleDataContext);
  return (
    <FormItem>
      <Label>Sample Data</Label>
      <Textarea
        className='font-mono text-sm'
        onChange={(e) => setSampleData(e.target.value)}
        placeholder='JSON data to use as input for expressions'
        value={sampleData}
      />
      {!isValidSampleData && <FormError>Invalid JSON</FormError>}
    </FormItem>
  );
}

function SampleDataProvider({ children }: PropsWithChildren) {
  const [sampleData, setSampleData] = useLocalStorage('sample-data', '{}');
  const isValidSampleData = useMemo(() => {
    try {
      JSON.parse(sampleData);
      return true;
    } catch {
      return false;
    }
  }, [sampleData]);

  return (
    <SampleDataContext.Provider
      value={[sampleData, setSampleData, isValidSampleData]}
    >
      {children}
    </SampleDataContext.Provider>
  );
}

const GenerationFormSchema = z.object({
  fields: z.array(
    z.object({
      expression: z.string().refine(
        (val) => {
          try {
            jsonata(val);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: 'Invalid JSONata expression',
        }
      ),
      label: z.string(),
      name: z.string().nonempty(),
      type: FieldTypeSchema,
    })
  ),
});

export function GenerationFormSection() {
  const document = useCurrentDocument();

  const context: ZodFormContext<typeof GenerationFormSchema> = useForm({
    defaultValues: {
      fields: document.generatedFields,
    },
    mode: 'onBlur',
    resolver: standardSchemaResolver(GenerationFormSchema, undefined, {
      raw: true,
    }),
  });

  const { handleSubmit, reset } = context;

  useEffect(() => {
    reset({ fields: document.generatedFields }, { keepValues: true });
  }, [document.generatedFields, reset]);

  const queryClient = useQueryClient();
  const { mutateAsync: handleSave } = useMutation({
    meta: {
      errorToast: 'Failed to save generated fields.',
      loadingToast: 'Saving...',
      successToast: 'Saved!',
    },
    async mutationFn({ fields }: z.input<typeof GenerationFormSchema>) {
      // Check that fields will match the schema before we update
      GeneratedFieldsSchema.parse(fields);

      await supabase
        .from('documents')
        .update({
          generated_fields: fields,
        })
        .eq('id', document.id)
        .throwOnError();
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ['supabase', 'public', 'documents', document.id],
      });
    },
  });

  return (
    <SampleDataProvider>
      <FormProvider {...context}>
        <form onSubmit={handleSubmit((data) => handleSave(data))}>
          <FormSection>
            <FormSectionHeader>
              <FormSectionTitle>Generation Options</FormSectionTitle>
            </FormSectionHeader>
            <FormSectionContent>
              <SampleDataFormContent />

              <PDFProvider documentId={document.id}>
                <GenerationFormContent />
              </PDFProvider>
            </FormSectionContent>
          </FormSection>
        </form>
      </FormProvider>
    </SampleDataProvider>
  );
}

function getFieldType(field: PDFField): FieldType {
  if (field instanceof PDFButton) {
    return 'button';
  } else if (field instanceof PDFCheckBox) {
    return 'checkbox';
  } else if (field instanceof PDFDropdown) {
    return 'dropdown';
  } else if (field instanceof PDFOptionList) {
    return 'select';
  } else if (field instanceof PDFTextField) {
    return 'text';
  } else if (field instanceof PDFRadioGroup) {
    return 'radio';
  } else if (field instanceof PDFSignature) {
    return 'signature';
  }

  throw new Error(`Unsupported field type: ${field.constructor.name}`);
}

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

async function createPDFPreview(pdf: PDFDocument, fieldName: string) {
  // Find the field in the PDF
  const field = pdf.getForm().getField(fieldName);
  const page = pdf.findPageForAnnotationRef(field.ref)!;
  const pageIdx = pdf.getPages().findIndex((p) => p.ref.tag === page.ref.tag);

  // Create Preview PDF with just the page containing our field
  const previewPdf = await PDFDocument.create();
  const [copiedPage] = await previewPdf.copyPages(pdf, [pageIdx]);
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
  return await previewPdf.saveAsBase64({
    dataUri: true,
    updateFieldAppearances: true,
  });
}

function GeneratedFieldItem({
  field,
  index,
  onPreview,
  onRemove,
}: {
  field: z.input<typeof GenerationFormSchema>['fields'][number];
  index: number;
  onPreview: () => void;
  onRemove: () => void;
}) {
  const [sampleData] = useRequiredContext(SampleDataContext);
  const [result, setResult] = useState<string>('null');
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const newResult = await jsonata(field.expression).evaluate(
          JSON.parse(sampleData)
        );
        if (!cancelled) {
          setResult(newResult ?? 'null');
        }
      } catch (error) {
        console.log('JSONata Evaluation error:', error);
        if (!cancelled) {
          setResult('ERROR');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [field.expression, sampleData]);

  return (
    <div className='grid grid-cols-[1fr_min-content] gap-2'>
      <div className='grid gap-2'>
        <div className='grid grid-cols-[min-content_auto_min-content] gap-2'>
          <FormField
            name={`fields.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field ID</FormLabel>
                <pre className='font-mono text-sm'>{field.value}</pre>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`fields.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <pre className='font-mono text-sm'>
                  {titleCase(field.value)}
                </pre>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button onClick={onPreview} size='icon' type='button'>
            <SquareArrowOutUpRightIcon />
          </Button>
        </div>
        <FormField
          name={`fields.${index}.label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={`fields.${index}.expression`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expression</FormLabel>
              <FormControl>
                <span className='inline-flex items-center gap-2 font-mono text-sm'>
                  <Input {...field} />
                  <EqualIcon />
                  <pre className='min-w-16'>{result}</pre>
                </span>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button
        className='self-center'
        onClick={onRemove}
        size='icon'
        type='button'
        variant='destructive'
      >
        <TrashIcon />
      </Button>
    </div>
  );
}

function GenerationFormComboBoxItem({
  disabled,
  field,
  label,
  onPreview,
}: {
  disabled: boolean;
  field: PDFField;
  label?: string;
  onPreview: () => void;
}) {
  return (
    <CommandItem
      disabled={disabled}
      key={field.getName()}
      value={field.getName()}
    >
      {field.getName()}

      {label && <span>({label})</span>}

      <Button
        className='ml-auto'
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        size='icon'
        type='button'
        variant='outline'
      >
        <SquareArrowOutUpRight />
      </Button>
      <FormListAddButton
        value={{
          expression: '',
          label: field.getName().split('.').pop() || '',
          name: field.getName(),
          type: getFieldType(field),
        }}
      >
        <Button size='icon' type='button' variant='outline'>
          <PlusIcon />
        </Button>
      </FormListAddButton>
    </CommandItem>
  );
}

function GenerationFormContent() {
  const pdf = usePDF();

  const pages = usePdfPages(pdf);
  const [comboOpen, setComboOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const {
    formState: { isDirty, isSubmitting },
    watch,
  }: ZodFormContext<typeof GenerationFormSchema> = useFormContext();
  const formFields = watch('fields');

  const { data: preview, mutate: handlePreview } = useMutation({
    meta: {
      errorToast: 'Failed to open preview.',
      loadingToast: 'Loading preview...',
    },
    mutationFn: async (name: string) => {
      const dataUri = await createPDFPreview(pdf, name);
      return { dataUri, name };
    },
    onSuccess() {
      setPreviewOpen(true);
    },
  });

  return (
    <>
      <FormList name='fields'>
        <FormListHeader>
          <FormListTitle>Generated Fields</FormListTitle>
          <FormListMessage />
        </FormListHeader>
        <FormListItems<z.input<typeof GenerationFormSchema>, 'fields'>>
          {(field, index, remove) => (
            <GeneratedFieldItem
              field={field}
              index={index}
              key={field.id}
              onPreview={() => handlePreview(field.name)}
              onRemove={remove}
            />
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
                className: 'min-h-20',
                rounded: 'lg',
                size: 'xl',
                variant: 'dashed',
              })}
              role='combobox'
              type='button'
              variant='outline'
            >
              Add Generated Field
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
                        <GenerationFormComboBoxItem
                          disabled={formFields.some(
                            ({ name }) => name === field.getName()
                          )}
                          field={field}
                          key={field.getName()}
                          label={
                            formFields.find(
                              ({ name }) => name === field.getName()
                            )?.label
                          }
                          onPreview={() => handlePreview(field.getName())}
                        />
                      ))}
                    </CommandGroup>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button disabled={!isDirty} loading={isSubmitting} type='submit'>
          Save Generated Fields
        </Button>

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
      </FormList>
    </>
  );
}
