import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizFieldTitle } from '@/components/ui/quiz/title';

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
          <FormBlock>
            <FormField control={control} name='isFromSafeCountry'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
