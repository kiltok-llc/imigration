import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { QuizPageTitle } from '@/components/quiz/title';
import { required } from '@/lib/utils';

export default function SpouseInformation() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          city: '',
          country: '',
          date: null,
        }}
        onSubmit={() => true}
        pageId='marriage-information'
        schema={z.object({
          city: z.string().nonempty(),
          country: z.string().nonempty(),
          date: required(z.date().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='date'>
                <QuizDateInput />
              </FormField>

              <FormField control={control} name='city'>
                <QuizTextInput />
              </FormField>

              <FormField control={control} name='country'>
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={DEFAULT_NAME}
        onSubmit={() => true}
        pageId='spouse-name'
        schema={NameSchema}
      >
        {({ lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormNameInput lens={lens} />
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
