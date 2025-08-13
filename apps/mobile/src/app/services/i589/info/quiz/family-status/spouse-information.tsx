import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { QuizDateInput } from '@/components/ui/quiz/date';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizPageTitle } from '@/components/ui/quiz/title';
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
        defaultValues={{
          firstName: '',
          lastName: '',
          middleName: '',
        }}
        onSubmit={() => true}
        pageId='spouse-name'
        schema={z.object({
          firstName: z.string().nonempty(),
          lastName: z.string().nonempty(),
          middleName: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='firstName'>
                <QuizTextInput />
              </FormField>

              <FormField control={control} name='middleName'>
                <QuizTextInput optional />
              </FormField>

              <FormField control={control} name='lastName'>
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
