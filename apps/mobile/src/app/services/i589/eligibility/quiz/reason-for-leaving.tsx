import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';
import z from 'zod/v4';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { FormCheckboxGroup, FormCheckboxItem } from '@/components/ui/form/checkbox';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { FormTextInput } from '@/components/ui/form/text';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { HarmReasonEnum } from '@/lib/services/i589/eligibility';
import { nullableInput } from '@/lib/utils';

export default function ReasonForLeaving() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Quiz>
      <QuizPage
        initialValues={{
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
        initialValues={{
          harmReasons: []
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
          customHarmReason: z.string().nonempty().optional(),
          harmReasons: z.array(HarmReasonEnum).nonempty()
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
                  <FormField control={control} name='customHarmReason'>

                  </FormField>
                </FormCheckboxGroup>
              </FormField>
            </View>

            <FadeView visible={watch('harmReasons').includes('other')}>
              <FormField control={control} disabled={!watch('harmReasons').includes('other')} name='customHarmReason'>
                <FormTextInput
                  label={t('services.i589.eligibility.reason-for-leaving.other')}
                />
              </FormField>
            </FadeView>
          </>
        )}
      </QuizPage>

      <QuizPage
        initialValues={{
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
    </Quiz>
  );
}
