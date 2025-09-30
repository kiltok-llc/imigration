import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizFormPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { required } from '@/lib/utils';

export default function ArrivalDate() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizFormPage
        defaultValues={{
          isRecentArrival: null,
        }}
        onSubmit={({ isRecentArrival }) => {
          if (!isRecentArrival) {
            router.navigate('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-recent-arrival'
        sampleData={{
          example: {
            isRecentArrival: true,
          },
        }}
        schema={z.object({
          isRecentArrival: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='isRecentArrival'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizFormPage>
    </QuizScreen>
  );
}
