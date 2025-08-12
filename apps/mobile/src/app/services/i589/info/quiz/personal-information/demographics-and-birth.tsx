import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormSexInput } from '@/components/ui/form/radio';
import { QuizDateInput } from '@/components/ui/quiz/date';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { SexEnum } from '@/lib/schema/common';
import { nullableInput } from '@/lib/utils';

export default function DemographicsAndBirth() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          dob: null,
          sex: null,
        }}
        onSubmit={() => {
          return true;
        }}
        pageId='basic-demographics'
        schema={z.object({
          dob: nullableInput(z.date()),
          sex: nullableInput(SexEnum),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='sex'>
                <QuizFieldTitle />
                <FormSexInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='dob'>
                <QuizFieldTitle />
                <QuizDateInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          birthCity: '',
          birthCountry: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId='birth-location'
        schema={z.object({
          birthCity: z.string().nonempty(),
          birthCountry: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='birthCountry'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='birthCity'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          birthNationality: '',
          currentNationality: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId='nationality'
        schema={z.object({
          birthNationality: z.string().nonempty(),
          currentNationality: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='birthNationality'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='currentNationality'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          ethnicity: '',
          religion: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId='additional-info'
        schema={z.object({
          ethnicity: z.string(),
          religion: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='ethnicity'>
                <QuizFieldTitle />
                <QuizTextInput optional />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='religion'>
                <QuizFieldTitle />
                <QuizTextInput optional />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
