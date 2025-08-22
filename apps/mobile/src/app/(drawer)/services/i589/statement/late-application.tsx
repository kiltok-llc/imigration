import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizLongTextInput } from '@/components/quiz/text';
import { lateApplicationDetailsAtom } from '@/lib/data/asylum';

export default function LateApplication() {
  const setLateApplicationDetails = useSetAtom(lateApplicationDetailsAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          details: '',
        }}
        onSubmit={({ details }) => {
          setLateApplicationDetails(details);
          return true;
        }}
        pageId="details"
        schema={z.object({
          details: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />

              <FormField control={control} name="details">
                <QuizLongTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
