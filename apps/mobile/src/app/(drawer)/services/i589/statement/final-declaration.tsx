import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizConfirmBox } from '@/components/quiz/checkbox';
import { QuizForm } from '@/components/quiz/form';
import { QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function FinalDeclaration() {
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='final-declaration'>
        <QuizForm
          defaultValues={{
            agreed: false,
          }}
          onSuccess={() => {}}
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
        </QuizForm>
      </QuizPage>
    </QuizScreen>
  );
}
