import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { required } from '@/lib/utils';

export default function USResidenceStatus() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          livesInUS: null,
        }}
        onSubmit={() => true}
        pageId='us-residence-status'
        schema={z.object({
          livesInUS: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='livesInUS'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
