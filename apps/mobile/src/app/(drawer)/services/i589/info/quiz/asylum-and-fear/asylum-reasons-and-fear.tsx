import tw from 'twrnc';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormCheckboxGroup } from '@/components/ui/form/checkbox';
import {
  ConditionalFormFieldBlock,
  FormField,
} from '@/components/ui/form/field';
import { QuizCheckboxItem } from '@/components/ui/quiz/checkbox';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
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
