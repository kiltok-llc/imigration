import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { ConditionalFormBlock, FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle, QuizPageTitle } from '@/components/ui/quiz/title';
import { required } from '@/lib/utils';

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
          middleName: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='firstName'>
                <QuizTextInput autoComplete='given-name' />
              </FormField>

              <FormField control={control} name='middleName'>
                <QuizTextInput autoComplete='name-middle' optional />
              </FormField>

              <FormField control={control} name='lastName'>
                <QuizTextInput autoComplete='family-name' />
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

              <ConditionalFormBlock
                active={!!watch('hasAlias')}
                activeValue=''
                control={control}
                name='aliasName'
              >
                <QuizTextInput />
              </ConditionalFormBlock>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
