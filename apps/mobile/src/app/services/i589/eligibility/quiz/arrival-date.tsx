import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

export default function ArrivalDate() {
  const router = useRouter();

  return (
    <Quiz>
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
            <FormLabel>
              <Trans i18nKey='services.i589.eligibility.arrival-date.is-recent' />
            </FormLabel>
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </Quiz>
  );
}
