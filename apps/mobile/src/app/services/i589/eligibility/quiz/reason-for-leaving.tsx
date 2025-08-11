import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import z from 'zod/v4';

import {
  FormCheckboxGroup,
  FormCheckboxItem,
} from '@/components/ui/form/checkbox';
import { ConditionalFormField, FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizLabel } from '@/components/ui/quiz/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { HarmReasonEnum } from '@/lib/services/i589/eligibility';
import { nullableInput } from '@/lib/utils';

export default function ReasonForLeaving() {
  const router = useRouter();
  const { t } = useTranslation();

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
          isEscapingHarm: nullableInput(z.boolean()),
        })}
      >
        {({ control }) => (
          <FormField control={control} name='isEscapingHarm'>
            <QuizLabel />
            <FormBooleanInput />
          </FormField>
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
          <>
            <View>
              <FormField control={control} name='harmReasons'>
                <QuizLabel />
                <FormCheckboxGroup>
                  {HarmReasonEnum.options.map((reason) => (
                    <FormCheckboxItem
                      exclusive={reason === 'none'}
                      key={reason}
                      label={t(
                        `services.i589.eligibility.reason-for-leaving.reasons.${reason}`
                      )}
                      value={reason}
                    />
                  ))}
                </FormCheckboxGroup>
              </FormField>
            </View>

            <ConditionalFormField
              active={watch('harmReasons').includes('other')}
              activeValue=''
              control={control}
              name='customHarmReason'
            >
              <QuizTextInput />
            </ConditionalFormField>
          </>
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
          isHarmedByGov: nullableInput(z.boolean()),
        })}
      >
        {({ control }) => (
          <FormField control={control} name='isHarmedByGov'>
            <QuizLabel />
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
