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
import { internationalCriminalHistoryDetailsAtom } from '@/lib/data/asylum';
import { required } from '@/lib/utils';

export default function InternationalCriminalHistory() {
  const [showDetails, setShowDetails] = useState(true);
  const setInternationalCriminalHistoryDetails = useSetAtom(
    internationalCriminalHistoryDetailsAtom
  );

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasInternationalCriminalHistory: false,
        }}
        onSuccess={({ hasInternationalCriminalHistory }) => {
          setShowDetails(hasInternationalCriminalHistory);
          if (!hasInternationalCriminalHistory) {
            setInternationalCriminalHistoryDetails('');
          }
          
        }}
        pageId='has-international-criminal-history'
        schema={z.object({
          hasInternationalCriminalHistory: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasInternationalCriminalHistory'>
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
            setInternationalCriminalHistoryDetails(details);
            
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
