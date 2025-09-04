import { useSetAtom } from 'jotai';
import { useState } from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import {
  QuizFieldDescription,
  QuizPageDescription,
  QuizPageTitle,
} from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizLongTextInput } from '@/components/quiz/text';
import { internationalImmigrationHistoryDetailsAtom } from '@/lib/data/asylum';
import { required } from '@/lib/utils';

export default function InternationalImmigrationHistory() {
  const [showDetails, setShowDetails] = useState(true);
  const setInternationalImmigrationHistoryDetails = useSetAtom(
    internationalImmigrationHistoryDetailsAtom
  );

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasInternationalImmigrationHistory: false,
        }}
        onSuccess={({ hasInternationalImmigrationHistory }) => {
          setShowDetails(hasInternationalImmigrationHistory);
          if (!hasInternationalImmigrationHistory) {
            setInternationalImmigrationHistoryDetails('');
          }
          
        }}
        pageId='has-international-immigration-history'
        schema={z.object({
          hasInternationalImmigrationHistory: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField
              control={control}
              name='hasInternationalImmigrationHistory'
            >
              <QuizFieldDescription />
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
            setInternationalImmigrationHistoryDetails(details);
            
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
    </QuizScreen>
  );
}
