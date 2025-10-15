import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormCheckboxGroup } from '@/components/form/checkbox';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizCheckboxItem } from '@/components/quiz/checkbox';
import { QuizForm } from '@/components/quiz/form';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

const HarmReasonEnum = z.enum([
  'nationality',
  'other',
  'politics',
  'race',
  'religion',
  'social',
  'none',
]);

export default function ReasonForLeaving() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage pageId='is-escaping-harm'>
        <QuizForm
          defaultValues={{
            isEscapingHarm: null,
          }}
          onSubmit={({ isEscapingHarm }) => {
            if (!isEscapingHarm) {
              router.navigate('../ineligible');
              return false;
            }

            return true;
          }}
          sampleData={{
            example: {
              isEscapingHarm: true,
            },
          }}
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
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='harm-reasons'>
        <QuizForm
          defaultValues={{
            customHarmReason: null,
            harmReasons: [],
          }}
          onSubmit={({ harmReasons }) => {
            if (harmReasons.includes('none')) {
              router.navigate('../ineligible');
              return false;
            }

            return true;
          }}
          sampleData={{
            example: {
              customHarmReason: 'Gender identity',
              harmReasons: ['politics', 'other'],
            },
          }}
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
                      <QuizCheckboxItem
                        exclusive={reason === 'none'}
                        key={reason}
                        value={reason}
                      />
                    ))}
                  </FormCheckboxGroup>
                </FormField>
              </FormBlock>

              <ConditionalFormWrapper
                active={watch('harmReasons').includes('other')}
                activeValue=''
                control={control}
                name='customHarmReason'
              >
                <FormBlock>
                  <QuizTextInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='is-harmed-by-gov'>
        <QuizForm
          defaultValues={{
            isHarmedByGov: null,
          }}
          onSubmit={({ isHarmedByGov }) => {
            if (!isHarmedByGov) {
              router.navigate('../ineligible');
              return false;
            }

            return true;
          }}
          sampleData={{
            example: {
              isHarmedByGov: true,
            },
          }}
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
        </QuizForm>
      </QuizPage>
    </QuizScreen>
  );
}
