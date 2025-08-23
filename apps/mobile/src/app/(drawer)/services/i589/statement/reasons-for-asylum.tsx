import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormCheckboxGroup } from '@/components/form/checkbox';
import { FormField } from '@/components/form/field';
import { QuizCheckboxItem } from '@/components/quiz/checkbox';
import { QuizFieldDescription, QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { AsylumReasonEnum, reasonsForAsylumAtom } from '@/lib/data/asylum';

export default function ReasonsForAsylum() {
  const setReasonsForAsylum = useSetAtom(reasonsForAsylumAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          reasons: [],
        }}
        onSubmit={({ reasons }) => {
          setReasonsForAsylum(reasons);
          return true;
        }}
        pageId='reasons'
        schema={z.object({
          reasons: z.array(AsylumReasonEnum).nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='reasons'>
                <QuizFieldTitle />
                <QuizFieldDescription />
                <FormCheckboxGroup>
                  {AsylumReasonEnum.options.map((reason) => (
                    <QuizCheckboxItem key={reason} value={reason} />
                  ))}
                </FormCheckboxGroup>
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
