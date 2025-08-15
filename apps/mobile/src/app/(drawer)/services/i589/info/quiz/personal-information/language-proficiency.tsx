import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { QuizFieldTitle } from '@/components/quiz/title';
import { required } from '@/lib/utils';

export default function LanguageProficiency() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          nativeLanguage: '',
        }}
        onSubmit={() => true}
        pageId='native-language'
        schema={z.object({
          nativeLanguage: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='nativeLanguage'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          readWriteEnglish: null,
          speakEnglish: null,
        }}
        onSubmit={() => true}
        pageId='english-proficiency'
        schema={z.object({
          readWriteEnglish: required(z.boolean().nullable()),
          speakEnglish: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='speakEnglish'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='readWriteEnglish'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          readWriteSpanish: null,
          speakSpanish: null,
        }}
        onSubmit={() => true}
        pageId='spanish-proficiency'
        schema={z.object({
          readWriteSpanish: required(z.boolean().nullable()),
          speakSpanish: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='speakSpanish'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='readWriteSpanish'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          otherLanguages: '',
        }}
        onSubmit={() => true}
        pageId='other-languages'
        schema={z.object({
          otherLanguages: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='otherLanguages'>
                <QuizFieldTitle />
                <QuizTextInput optional />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
