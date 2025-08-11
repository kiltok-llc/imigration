import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizLabel } from '@/components/ui/quiz/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

export default function PreviousApplications() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasPreviousApp: null,
        }}
        onSubmit={({ hasPreviousApp }) => {
          if (hasPreviousApp) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='has-previous-app'
        schema={z.object({
          hasPreviousApp: nullableInput(z.boolean()),
        })}
      >
        {({ control }) => (
          <FormField control={control} name='hasPreviousApp'>
            <QuizLabel />
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
