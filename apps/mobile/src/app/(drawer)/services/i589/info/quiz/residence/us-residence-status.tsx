import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizFieldTitle } from '@/components/quiz/title';
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
