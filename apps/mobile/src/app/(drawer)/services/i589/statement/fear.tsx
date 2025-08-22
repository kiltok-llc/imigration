import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizLongTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

export default function Fear() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasFear: false,
        }}
        onSubmit={() => true}
        pageId="details"
        schema={z.object({
          details: z.string().nonempty().optional(),
          hasFear: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name="hasFear">
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('hasFear')}
              activeValue=""
              control={control}
              name="details"
            >
              <FormBlock>
                <QuizPageTitle />
                <QuizPageDescription />

                <FormField control={control} name="details">
                  <QuizLongTextInput />
                </FormField>
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
