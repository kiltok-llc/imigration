import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import {QuizFieldDescription, QuizFieldTitle, QuizPageDescription, QuizPageTitle} from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizLongTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

export default function FearOfTorture() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasFearOfTorture: false,
        }}
        onSubmit={() => true}
        pageId="torture"
        schema={z.object({
          details: z.string().nonempty().optional(),
          hasFearOfTorture: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name="hasFearOfTorture">
                <QuizFieldTitle />
                <QuizFieldDescription />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('hasFearOfTorture')}
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
