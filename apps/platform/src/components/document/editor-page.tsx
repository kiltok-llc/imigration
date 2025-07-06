'use client';
import { PDFDocument } from '@cantoo/pdf-lib';
import { cloneDeep, DesignerProps } from '@pdfme/common';
import { pdf2size } from '@pdfme/converter';
import { Designer } from '@pdfme/ui';
import { Json } from '@repo/supabase/database.types';
import {
  CopyIcon,
  EditIcon,
  FileJsonIcon,
  FileScanIcon,
  TrashIcon,
} from 'lucide-react';
import { ChangeEvent, RefObject, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useInterval, useUnmount } from 'usehooks-ts';

import DocumentDesigner from '@/components/document/designer';
import { DeleteDocumentDialog } from '@/components/document/modal/delete';
import { DuplicateDocumentDialog } from '@/components/document/modal/duplicate';
import { EditDocumentDialog } from '@/components/document/modal/edit';
import { GenerateDocumentDialog } from '@/components/document/modal/generate';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { H3, Muted } from '@/components/ui/typography';
import { supabase } from '@/lib/supabase/client';
import { zip } from '@/lib/utils';
import {
  CurrentDocument,
  useCurrentDocument,
} from '@/queries/current-document';

// TODO refactor this into DocumentDesignerContext + DocumentDesignerHeader & DocumentDesigner components

export function DocumentEditorPage() {
  const document = useCurrentDocument();
  const designerRef = useRef<Designer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);

  const onSave = async (template: DesignerProps['template']) => {
    setDirty(false);

    const { error } = await supabase
      .from('documents')
      .update({ template: template as Json })
      .eq('id', document.id);

    if (error) {
      setDirty(true);
      console.error('Error saving survey:', error);
      throw error;
    }
  };

  // autosave
  useInterval(
    () => {
      designerRef.current?.saveTemplate();
    },
    dirty ? 20_000 : null
  );

  // save on unmount
  useUnmount(() => {
    if (dirty) {
      designerRef.current?.saveTemplate();
    }
  });

  return (
    <>
      <Section size='xs'>
        <DocumentHeader designerRef={designerRef} document={document} />
      </Section>

      <Section className='pb-0' size='xs' viewport>
        <DocumentDesigner
          className='h-full w-full'
          containerRef={containerRef}
          onChangeTemplate={() => {
            setDirty(true);
          }}
          onSaveTemplate={(template) => {
            toast.promise(onSave(template), {
              error: 'Error saving template',
              loading: 'Saving template...',
              success: 'Saved!',
            });
          }}
          ref={designerRef}
          template={document.template}
        />
      </Section>
    </>
  );
}

function DocumentHeader({
  designerRef,
  document,
}: {
  readonly designerRef: RefObject<Designer | null>;
  readonly document: CurrentDocument;
}) {
  const onChangeBasePDF = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!designerRef.current) {
      throw new Error('Designer reference is not set');
    }

    const file = e.target.files?.item(0);
    if (!file) {
      throw new Error('No file selected');
    }

    const pdfData = await file.arrayBuffer();
    const pdfDataUrl = `data:${file.type};base64,${btoa(new Uint8Array(pdfData).reduce((data, byte) => data + String.fromCodePoint(byte), ''))}`;

    const newTemplate = cloneDeep(designerRef.current.getTemplate());
    newTemplate.basePdf = pdfDataUrl;
    newTemplate.schemas = [];

    const pdfDoc = await PDFDocument.load(pdfData, {
      ignoreEncryption: true,
      password: '',
    });
    const pages = pdfDoc.getPages();
    const form = pdfDoc.getForm();
    const pdfmePageSizes = await pdf2size(pdfData);
    const pdflibPageSizes = pages.map((page) => page.getSize());
    const pageTransforms = zip(pdfmePageSizes, pdflibPageSizes).map(
      ([a, b]) => ({
        x: a.width / b.width,
        y: a.height / b.height,
      })
    );

    let hasUnsupportedFields = false;

    for (const field of form.getFields()) {
      const name = field.getName();
      const acroType = field.acroField.FT().decodeText();
      const type = {
        Btn: 'checkbox',
        Tx: 'text',
      }[field.acroField.FT().decodeText()];
      if (type === undefined) {
        console.warn(`Unsupported field type: ${acroType} (${name})`);
        hasUnsupportedFields = true;
        continue;
      }

      const widgets = field.acroField.getWidgets();
      if (widgets.length === 0) {
        console.warn(`Field ${name} has no widgets`);
        continue;
      }

      if (widgets.length > 1) {
        console.warn(
          `Field ${name} has multiple widgets, using the first one:`,
          widgets
        );
      }

      const widget = widgets[0]!;
      const page = pages.findIndex((p) => p.ref === widget.P());
      if (page === -1) {
        console.warn('Widget page not found:', name);
        continue;
      }

      const rect = widget.getRectangle();
      const { x, y } = pageTransforms[page]!;
      const { height: pageHeight } = pdfmePageSizes[page]!;
      const { height, position, width } = {
        height: rect.height * x,
        position: {
          x: rect.x * x,
          y: pageHeight - rect.y * y - rect.height / 3,
        },
        width: rect.width * y,
      };

      (newTemplate.schemas[page] ??= []).push({
        height,
        name,
        position,
        type,
        width,
      });
    }

    if (hasUnsupportedFields) {
      toast.error(
        'Some fields in the PDF are not supported. Please check the console for details.'
      );
    }

    designerRef.current.updateTemplate(newTemplate);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container className='flex flex-row justify-between gap-8' size='full'>
      <div>
        <H3>{document.name}</H3>

        <Muted>{document.description}</Muted>
      </div>

      <div className='flex flex-row gap-2'>
        <GenerateDocumentDialog document={document}>
          <Button size='icon'>
            <FileJsonIcon />
          </Button>
        </GenerateDocumentDialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                fileInputRef.current?.click();
              }}
              size='icon'
            >
              <FileScanIcon />

              <input
                accept='application/pdf'
                className='hidden'
                onChange={(e) => {
                  toast.promise(
                    onChangeBasePDF(e).catch((error: unknown) => {
                      console.error('Error loading PDF:', error);
                      throw error;
                    }),
                    {
                      error: 'Error loading PDF',
                      loading: 'Loading PDF...',
                      success: 'Base PDF updated!',
                    }
                  );
                }}
                ref={fileInputRef}
                type='file'
              />
            </Button>
          </TooltipTrigger>

          <TooltipContent>Change base PDF</TooltipContent>
        </Tooltip>

        <EditDocumentDialog document={document}>
          <Button size='icon'>
            <EditIcon />
          </Button>
        </EditDocumentDialog>

        <DuplicateDocumentDialog document={document}>
          <Button size='icon'>
            <CopyIcon />
          </Button>
        </DuplicateDocumentDialog>

        <DeleteDocumentDialog document={document}>
          <Button size='icon' variant='destructive'>
            <TrashIcon />
          </Button>
        </DeleteDocumentDialog>
      </div>
    </Container>
  );
}
