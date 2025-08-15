import { useRouter } from 'expo-router';
import * as React from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
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
