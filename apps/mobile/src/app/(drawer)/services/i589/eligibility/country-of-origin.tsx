import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFormPage } from '@/components/quiz/form-page';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizScreen } from '@/components/quiz/screen';

export default function CountryOfOrigin() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizFormPage
        defaultValues={{
          isFromSafeCountry: null,
        }}
        onSubmit={({ isFromSafeCountry }) => {
          if (isFromSafeCountry) {
            router.navigate('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-from-safe-country'
        sampleData={{
          example: {
            isFromSafeCountry: false,
          },
        }}
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
      </QuizFormPage>
    </QuizScreen>
  );
}
