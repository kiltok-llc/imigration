import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/eligibility';

export default function CountryOfOrigin() {
  const router = useRouter();

  return (
    <Quiz>
      <QuizPage
        initialValues={{
          isFromSafeCountry: null,
        }}
        onSubmit={({ isFromSafeCountry }) => {
          if (isFromSafeCountry) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-from-safe-country'
        schema={z.object({
          isFromSafeCountry: z.boolean().nullable(),
        })}
      >
        {({ control }) => (
          <FormField control={control} name='isFromSafeCountry'>
            <FormLabel>
              <Trans i18nKey='services.i589.eligibility.country-of-origin.is-from-safe-country' />
            </FormLabel>
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </Quiz>
  );
}
