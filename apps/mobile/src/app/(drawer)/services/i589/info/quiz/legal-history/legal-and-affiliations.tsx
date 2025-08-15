import tw from 'twrnc';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import {
  ConditionalFormFieldBlock,
  FormField,
} from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
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
          <FormBlock>
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
          </FormBlock>
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
