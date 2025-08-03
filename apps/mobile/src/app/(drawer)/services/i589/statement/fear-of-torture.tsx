import { useSetAtom } from 'jotai';
import { useState } from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormDocumentsInput } from '@/components/form/document';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import {
  QuizFieldTitle,
  QuizPageDescription,
  QuizPageTitle,
} from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizLongTextInput } from '@/components/quiz/text';
import { fearOfTortureDetailsAtom } from '@/lib/data/asylum';
import { required } from '@/lib/utils';

export default function FearOfTorture() {
  const [showDetails, setShowDetails] = useState(true);
  const setFearOfTortureDetails = useSetAtom(fearOfTortureDetailsAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasFearOfTorture: false,
        }}
        onSuccess={({ hasFearOfTorture }) => {
          setShowDetails(hasFearOfTorture);
          if (!hasFearOfTorture) {
            setFearOfTortureDetails('');
          }
        }}
        pageId='has-fear-of-torture'
        schema={z.object({
          hasFearOfTorture: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasFearOfTorture'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      {showDetails && (
        <QuizPage
          defaultValues={{
            details: '',
          }}
          onSuccess={({ details }) => {
            setFearOfTortureDetails(details);
          }}
          pageId='details'
          schema={z.object({
            details: z.string().nonempty(),
          })}
        >
          {({ control }) => (
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />
              <FormField control={control} name='details'>
                <QuizLongTextInput />
              </FormField>
            </FormBlock>
          )}
        </QuizPage>
      )}

      {showDetails && (
        <QuizPage
          defaultValues={{
            documents: [],
          }}
          onSubmit={() => true}
          pageId='documents'
          schema={z.object({
            documents: z.array(z.string()),
          })}
        >
          {({ control }) => (
            <FormBlock>
              <FormBlock>
                <QuizPageTitle />
                <QuizPageDescription />
                <FormField control={control} name='documents'>
                  <FormDocumentsInput />
                </FormField>
              </FormBlock>
            </FormBlock>
          )}
        </QuizPage>
      )}
    </QuizScreen>
  );
}
