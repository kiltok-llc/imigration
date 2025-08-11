import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizLabel } from '@/components/ui/quiz/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

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
          isInUsa: nullableInput(z.boolean()),
        })}
      >
        {({ control }) => (
          <FormField control={control} name='isInUsa'>
            <QuizLabel />
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
