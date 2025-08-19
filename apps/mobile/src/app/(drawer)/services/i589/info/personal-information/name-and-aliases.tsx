import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

export default function NameAndAliases() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={DEFAULT_NAME}
        onSubmit={() => true}
        pageId='basic-names'
        schema={NameSchema}
      >
        {({ lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormNameInput lens={lens} />
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          maidenName: '',
          otherNames: '',
        }}
        onSubmit={() => true}
        pageId='additional-names'
        schema={z.object({
          maidenName: z.string(),
          otherNames: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='maidenName'>
                <QuizTextInput optional />
              </FormField>

              <FormField control={control} name='otherNames'>
                <QuizTextInput optional />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasAlias: null,
        }}
        onSubmit={() => true}
        pageId='alias-information'
        schema={z.object({
          aliasName: z.string().nonempty().optional(),
          hasAlias: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasAlias'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>

              <ConditionalFormFieldBlock
                active={!!watch('hasAlias')}
                activeValue=''
                control={control}
                name='aliasName'
              >
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
