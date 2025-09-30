import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizConfirmBox } from '@/components/quiz/checkbox';
import { QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizFormPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function FinalDeclaration() {
  return (
    <QuizScreen>
      <QuizFormPage
        defaultValues={{
          agreed: false,
        }}
        onSuccess={() => {}}
        pageId='final-declaration'
        sampleData={{
          example: {
            agreed: true,
          },
        }}
        schema={z.object({
          agreed: z.literal<boolean>(true),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />
              <FormField control={control} name='agreed'>
                <QuizConfirmBox />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizFormPage>
    </QuizScreen>
  );
}
