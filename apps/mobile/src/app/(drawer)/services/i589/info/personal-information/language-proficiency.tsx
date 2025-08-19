import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { LANGUAGE_OPTIONS } from '@/components/form/dropdown';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizDropdown, QuizMultiDropdown } from '@/components/quiz/dropdown';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { required } from '@/lib/utils';

export default function LanguageProficiency() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          dialect: '',
          language: '',
        }}
        onSubmit={() => true}
        pageId='native-language'
        schema={z.object({
          dialect: z.string(),
          language: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='language'>
                <QuizFieldTitle />
                <QuizDropdown options={LANGUAGE_OPTIONS} />
              </FormField>
              <FormField control={control} name='dialect'>
                <QuizTextInput optional />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          readWrite: null,
          speak: null,
        }}
        onSubmit={() => true}
        pageId='english-proficiency'
        schema={z.object({
          readWrite: required(z.boolean().nullable()),
          speak: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='speak'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='readWrite'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          readWrite: null,
          speak: null,
        }}
        onSubmit={() => true}
        pageId='spanish-proficiency'
        schema={z.object({
          readWrite: required(z.boolean().nullable()),
          speak: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='speak'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='readWrite'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          languages: [],
        }}
        onSubmit={() => true}
        pageId='other-languages'
        schema={z.object({
          languages: z.array(z.string()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='languages'>
                <QuizFieldTitle />
                <QuizMultiDropdown
                  options={LANGUAGE_OPTIONS.filter(
                    ({ value }) => !['en', 'es'].includes(value)
                  )}
                />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
