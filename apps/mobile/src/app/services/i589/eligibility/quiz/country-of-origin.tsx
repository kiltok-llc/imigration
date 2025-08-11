import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizLabel } from '@/components/ui/quiz/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';

export default function CountryOfOrigin() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
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
            <QuizLabel />
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
