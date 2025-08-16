import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { required } from '@/lib/utils';

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
          hasPreviousApp: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasPreviousApp'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
