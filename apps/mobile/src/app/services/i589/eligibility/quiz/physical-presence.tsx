import { useRouter } from 'expo-router';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

export default function PhysicalPresence() {
  const router = useRouter();

  return (
    <Quiz>
      <QuizPage
        initialValues={{
          isInUsa: null
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
          isInUsa: nullableInput(z.boolean())
        })}
      >
        {({ control }) => (
          <FormField control={control} name='isInUsa'>
            <FormLabel>
              <Trans i18nKey='services.i589.eligibility.physical-presence.is-in-usa' />
            </FormLabel>
            <FormBooleanInput />
          </FormField>
        )}
      </QuizPage>
    </Quiz>
  );
}
