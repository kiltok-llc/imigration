import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizConfirmBox } from '@/components/quiz/checkbox';
import { QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { useService } from '@/hooks/use-service';
import { useStep } from '@/hooks/use-step';
import { isStepStartedAtom } from '@/lib/step';

export default function Intro() {
  const service = useService();
  const step = useStep();
  const setIsStepStarted = useSetAtom(isStepStartedAtom({ service, step }));

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          agreed: false,
        }}
        onSuccess={() => {
          setIsStepStarted(true);
        }}
        pageId='intro'
        schema={z.object({
          agreed: z.literal<boolean>(true),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />
              <FormField control={control} name='agreed'>
                <QuizConfirmBox />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
