import tw from 'twrnc';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormCheckboxGroup } from '@/components/form/checkbox';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { QuizCheckboxItem } from '@/components/quiz/checkbox';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { HarmReasonEnum } from '@/lib/schema/services/i589/eligibility';

export default function AsylumReasonsAndFear() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          customHarmReason: null,
          harmReasons: [],
        }}
        onSubmit={() => true}
        pageId='detailed-harm-reasons'
        schema={z.object({
          customHarmReason: z.string().nonempty().nullable(),
          harmReasons: z.array(HarmReasonEnum).nonempty(),
        })}
      >
        {({ control, watch }) => (
          <FormBlock>
            <FormBlock>
              <FormField control={control} name='harmReasons'>
                <QuizFieldTitle />
                <FormCheckboxGroup>
                  {HarmReasonEnum.options.map((reason) => (
                    <QuizCheckboxItem key={reason} value={reason} />
                  ))}
                </FormCheckboxGroup>
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={watch('harmReasons').includes('other')}
              activeValue=''
              control={control}
              name='customHarmReason'
            >
              <QuizTextInput />
            </ConditionalFormFieldBlock>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          persecutionDescription: '',
        }}
        onSubmit={() => true}
        pageId='persecution-description'
        schema={z.object({
          persecutionDescription: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='persecutionDescription'>
              <QuizFieldTitle />
              <QuizTextInput multiline style={tw`min-h-60`} />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
