import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { required } from '@/lib/utils';

export default function PhysicalPresence() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          isInUsa: null,
        }}
        onSubmit={({ isInUsa }) => {
          if (!isInUsa) {
            router.navigate('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-in-usa'
        schema={z.object({
          isInUsa: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='isInUsa'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
