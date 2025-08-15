import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormCheckboxGroup } from '@/components/form/checkbox';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizCheckboxItem } from '@/components/quiz/checkbox';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { QuizFieldTitle } from '@/components/quiz/title';
import { HarmReasonEnum } from '@/lib/schema/services/i589/eligibility';
import { required } from '@/lib/utils';

export default function ReasonForLeaving() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          isEscapingHarm: null,
        }}
        onSubmit={({ isEscapingHarm }) => {
          if (!isEscapingHarm) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-escaping-harm'
        schema={z.object({
          isEscapingHarm: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='isEscapingHarm'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          customHarmReason: null,
          harmReasons: [],
        }}
        onSubmit={({ harmReasons }) => {
          if (harmReasons.includes('none')) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='harm-reasons'
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
                    <QuizCheckboxItem
                      exclusive={reason === 'none'}
                      key={reason}
                      value={reason}
                    />
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
          isHarmedByGov: null,
        }}
        onSubmit={({ isHarmedByGov }) => {
          if (!isHarmedByGov) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-harmed-by-gov'
        schema={z.object({
          isHarmedByGov: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='isHarmedByGov'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
