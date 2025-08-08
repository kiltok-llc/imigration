import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

export default function PreviousApplications() {
  const router = useRouter();

  return (
    <Quiz>
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
            <FormLabel>
              <Trans i18nKey='services.i589.eligibility.previous-applications.has-previous-app' />
            </FormLabel>
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </Quiz>
  );
}
