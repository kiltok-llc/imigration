import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizFormPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { required } from '@/lib/utils';

export default function PreviousApplications() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizFormPage
        defaultValues={{
          hasPreviousApp: null,
        }}
        onSubmit={({ hasPreviousApp }) => {
          if (hasPreviousApp) {
            router.navigate('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='has-previous-app'
        sampleData={{
          example: {
            hasPreviousApp: false,
          },
        }}
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
      </QuizFormPage>
    </QuizScreen>
  );
}
