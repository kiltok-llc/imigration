import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function DemographicsAndBirth() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          dob: null,
          sex: null,
        }}
        onSubmit={() => true}
        pageId='basic-demographics'
        schema={z.object({
          dob: required(z.date().nullable()),
          sex: required(SexEnum.nullable()),
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
        onSubmit={() => true}
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
        onSubmit={() => true}
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
        onSubmit={() => true}
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

      <QuizPage
        defaultValues={{
          hasBirthCertificate: null,
        }}
        onSubmit={() => true}
        pageId='birth-certificate'
        schema={z.object({
          hasBirthCertificate: required(z.boolean().nullable()),
          image: required(z.string().nullable()).optional(),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasBirthCertificate'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasBirthCertificate')}
              activeValue={null}
              control={control}
              name='image'
            >
              <QuizFieldTitle />
              <FormImageInput />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
