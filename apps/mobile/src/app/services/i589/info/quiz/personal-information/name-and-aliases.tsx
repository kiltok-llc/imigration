import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { ConditionalFormField, FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle, QuizPageTitle } from '@/components/ui/quiz/title';
import { nullableInput } from '@/lib/utils';

export default function NameAndAliases() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          firstName: '',
          lastName: '',
          middleName: '',
        }}
        onSubmit={() => true}
        pageId="basic-names"
        schema={z.object({
          firstName: z.string().nonempty(),
          lastName: z.string().nonempty(),
          middleName: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name="firstName">
                <QuizTextInput />
              </FormField>

              <FormField control={control} name="middleName">
                <QuizTextInput optional />
              </FormField>

              <FormField control={control} name="lastName">
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          maidenName: '',
          otherNames: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId="additional-names"
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
              <FormField control={control} name="maidenName">
                <QuizTextInput optional />
              </FormField>

              <FormField control={control} name="otherNames">
                <QuizTextInput optional />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          aliasName: null,
          hasAlias: null,
        }}
        onSubmit={() => true}
        pageId="alias-information"
        schema={z.object({
          aliasName: z.string().nonempty().nullable(),
          hasAlias: nullableInput(z.boolean()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name="hasAlias">
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>

              <ConditionalFormField
                active={!!watch('hasAlias')}
                activeValue=""
                control={control}
                name="aliasName"
              >
                <QuizTextInput />
              </ConditionalFormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
