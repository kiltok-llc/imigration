import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizLabel } from '@/components/ui/quiz/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

export default function ArrivalDate() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          isRecentArrival: null,
        }}
        onSubmit={({ isRecentArrival }) => {
          if (!isRecentArrival) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
        pageId='is-recent-arrival'
        schema={z.object({
          isRecentArrival: nullableInput(z.boolean()),
        })}
      >
        {({ control }) => (
          <FormField control={control} name='isRecentArrival'>
            <QuizLabel />
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
