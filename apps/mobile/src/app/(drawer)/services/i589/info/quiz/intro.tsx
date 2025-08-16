import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizConfirmBox } from '@/components/quiz/checkbox';
import { QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';

export default function Intro() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          agreed: false,
        }}
        onSubmit={() => true}
        pageId='intro'
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
      </QuizPage>
    </QuizScreen>
  );
}
