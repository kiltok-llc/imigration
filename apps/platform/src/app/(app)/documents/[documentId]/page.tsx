import { GenerationFormSection } from '@/components/document/form/generation';
import { PDFFormSection } from '@/components/document/form/pdf';
import { Container } from '@/components/ui/container';
import { FormLayout } from '@/components/ui/form-layout';
import { Section } from '@/components/ui/section';
import { dbId } from '@/lib/id';
import { makeQueryClient } from '@/lib/query';
import {
  documentPDFMetadataQueryOptions,
  documentPDFUrlQueryOptions,
} from '@/queries/pdf';

export const metadata = {
  title: 'Document Editor',
};

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  const queryClient = makeQueryClient();

  void queryClient.prefetchQuery(documentPDFUrlQueryOptions(dbId(documentId)));
  void queryClient.prefetchQuery(
    documentPDFMetadataQueryOptions(dbId(documentId))
  );

  return (
    <>
      <Section viewport>
        <Container>
          <FormLayout>
            <PDFFormSection />
            <GenerationFormSection />
          </FormLayout>
        </Container>
      </Section>
    </>
  );
}
