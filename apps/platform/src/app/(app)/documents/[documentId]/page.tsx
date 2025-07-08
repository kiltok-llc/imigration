import { GenerationFormSection } from '@/components/document/form/generation';
import { PDFFormSection } from '@/components/document/form/pdf';
import { Container } from '@/components/ui/container';
import { FormLayout } from '@/components/ui/form-layout';
import { Section } from '@/components/ui/section';

export const metadata = {
  title: 'Document Editor',
};

export default function DocumentPage() {
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
