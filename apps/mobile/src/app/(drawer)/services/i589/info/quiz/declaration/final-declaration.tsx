import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

export default function FinalDeclaration() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          informationAccurate: null,
        }}
        onSubmit={() => true}
        pageId='information-accuracy'
        schema={z.object({
          informationAccurate: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='informationAccurate'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          understandsConsequences: null,
        }}
        onSubmit={() => true}
        pageId='understands-consequences'
        schema={z.object({
          understandsConsequences: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='understandsConsequences'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          needsInterpreter: null,
        }}
        onSubmit={() => true}
        pageId='interpreter-needed'
        schema={z.object({
          interpreterLanguage: z.string().nonempty().optional(),
          needsInterpreter: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <FormBlock>
            <FormBlock>
              <FormField control={control} name='needsInterpreter'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('needsInterpreter')}
              activeValue=''
              control={control}
              name='interpreterLanguage'
            >
              <QuizFieldTitle />
              <QuizTextInput />
            </ConditionalFormFieldBlock>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          applicantSignature: '',
          signatureDate: new Date(),
        }}
        onSubmit={() => true}
        pageId='signature'
        schema={z.object({
          applicantSignature: z.string().nonempty(),
          signatureDate: z.date(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='applicantSignature'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='signatureDate'>
                <QuizFieldTitle />
                <QuizDateInput readOnly={true} />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
