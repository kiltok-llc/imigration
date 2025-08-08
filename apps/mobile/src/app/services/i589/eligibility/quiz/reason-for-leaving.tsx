import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';
import z from 'zod/v4';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { Checkbox, FormCheckboxGroup } from '@/components/ui/form/checkbox';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { HarmReasonEnum } from '@/lib/services/i589/eligibility';

export default function ReasonForLeaving() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Quiz>
      <QuizPage
        onSubmit={({ isEscapingHarm }) => {
          if (!isEscapingHarm) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-escaping-harm'
        schema={z.object({
          isEscapingHarm: z.boolean(),
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
        onSubmit={({ harmReasons }) => {
          if (harmReasons.includes('none')) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='harm-reasons'
        schema={z.object({
          customHarmReason: z.string().optional(),
          harmReasons: z.array(HarmReasonEnum).min(1),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormField control={control} name='harmReasons'>
              <FormLabel>
                <Trans i18nKey='services.i589.eligibility.reason-for-leaving.harm-reasons' />
              </FormLabel>
              <FormCheckboxGroup>
                {HarmReasonEnum.options.map((reason) => (
                  <Checkbox
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

            <FadeView visible={watch('harmReasons').includes('other')}>
              <FormField control={control} name='customHarmReason'>
                <TextInput
                  label={t(
                    'services.i589.eligibility.reason-for-leaving.other'
                  )}
                  value='hi'
                />
              </FormField>
            </FadeView>
          </>
        )}
      </QuizPage>

      <QuizPage
        onSubmit={({ isHarmedByGov }) => {
          if (!isHarmedByGov) {
            toast.error(
              t('services.i589.eligibility.reason-for-leaving.gov-not-harm')
            );
            return false;
          }

          return true;
        }}
        pageId='is-harmed-by-gov'
        schema={z.object({
          isHarmedByGov: z.boolean(),
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
