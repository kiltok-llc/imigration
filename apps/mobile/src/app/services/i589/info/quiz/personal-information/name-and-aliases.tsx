import z from 'zod/v4';

import { ConditionalFormField, FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizLabel } from '@/components/ui/quiz/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
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
        pageId='basic-names'
        schema={z.object({
          firstName: z.string().nonempty(),
          lastName: z.string().nonempty(),
          middleName: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <QuizLabel />

            <FormField control={control} name='lastName'>
              <QuizTextInput />
            </FormField>

            <FormField control={control} name='firstName'>
              <QuizTextInput />
            </FormField>

            <FormField control={control} name='middleName'>
              <QuizTextInput />
            </FormField>
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
        pageId='additional-names'
        schema={z.object({
          maidenName: z.string(),
          otherNames: z.string(),
        })}
      >
        <QuizLabel />

        <FormField name='maidenName'>
          <QuizTextInput />
        </FormField>

        <FormField name='otherNames'>
          <QuizTextInput />
        </FormField>
      </QuizPage>

      <QuizPage
        defaultValues={{
          aliasName: null,
          hasAlias: null,
        }}
        onSubmit={() => true}
        pageId='alias-information'
        schema={z.object({
          aliasName: z.string().nonempty().nullable(),
          hasAlias: nullableInput(z.boolean()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormField control={control} name='hasAlias'>
              <QuizLabel />
              <FormBooleanInput />
            </FormField>

            <ConditionalFormField
              active={!!watch('hasAlias')}
              activeValue=''
              control={control}
              name='aliasName'
            >
              <QuizTextInput />
            </ConditionalFormField>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
