import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
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
            router.replace('../ineligible');
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
