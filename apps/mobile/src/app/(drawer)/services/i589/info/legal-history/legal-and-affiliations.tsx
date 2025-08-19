import tw from 'twrnc';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

export default function LegalAndAffiliations() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasArrestHistory: null,
        }}
        onSubmit={() => true}
        pageId='arrest-history'
        schema={z.object({
          arrestDetails: z.string().nonempty().optional(),
          hasArrestHistory: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasArrestHistory'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasArrestHistory')}
              activeValue=''
              control={control}
              name='arrestDetails'
            >
              <QuizFieldTitle />
              <QuizTextInput multiline style={tw`min-h-60`} />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasMilitaryService: null,
        }}
        onSubmit={() => true}
        pageId='military-service'
        schema={z.object({
          hasMilitaryService: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasMilitaryService'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
