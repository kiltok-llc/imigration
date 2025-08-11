import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import {
  FormCheckboxGroup,
  FormCheckboxItem,
} from '@/components/ui/form/checkbox';
import { ConditionalFormField, FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { FormTextInput } from '@/components/ui/form/text';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
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
            <FormLabel>
              <Trans i18nKey='services.i589.eligibility.reason-for-leaving.is-escaping-harm' />
            </FormLabel>
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
                <FormLabel>
                  <Trans i18nKey='services.i589.eligibility.reason-for-leaving.harm-reasons' />
                </FormLabel>
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
              <FormTextInput
                label={t('services.i589.eligibility.reason-for-leaving.other')}
              />
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
            <FormLabel>
              <Trans i18nKey='services.i589.eligibility.reason-for-leaving.is-harmed-by-gov' />
            </FormLabel>
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
