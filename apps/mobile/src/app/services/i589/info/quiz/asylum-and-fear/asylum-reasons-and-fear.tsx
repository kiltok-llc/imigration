import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormCheckboxGroup } from '@/components/ui/form/checkbox';
import { ConditionalFormBlock, FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizCheckboxItem } from '@/components/ui/quiz/checkbox';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { HarmReasonEnum } from '@/lib/schema/services/i589/eligibility';
import { required } from '@/lib/utils';

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
          <>
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

            <FormBlock>
              <ConditionalFormBlock
                active={watch('harmReasons').includes('other')}
                activeValue=''
                control={control}
                name='customHarmReason'
              >
                <QuizTextInput />
              </ConditionalFormBlock>
            </FormBlock>
          </>
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
              <QuizTextInput multiline />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          fearOfReturn: null,
        }}
        onSubmit={() => true}
        pageId='fear-of-return'
        schema={z.object({
          fearOfReturn: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='fearOfReturn'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          fearDescription: '',
        }}
        onSubmit={() => true}
        pageId='fear-description'
        schema={z.object({
          fearDescription: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='fearDescription'>
              <QuizFieldTitle />
              <QuizTextInput multiline />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasOtherCountryFear: null,
        }}
        onSubmit={() => true}
        pageId='other-country-fear'
        schema={z.object({
          hasOtherCountryFear: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasOtherCountryFear'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
