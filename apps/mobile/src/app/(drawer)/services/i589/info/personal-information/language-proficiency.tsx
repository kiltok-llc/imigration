import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { LANGUAGE_OPTIONS } from '@/components/form/dropdown';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizDropdown, QuizMultiDropdown } from '@/components/quiz/dropdown';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import {
  englishAtom,
  nativeLanguageAtom,
  otherLanguagesAtom,
} from '@/lib/data/user';
import { required } from '@/lib/utils';

export default function LanguageProficiency() {
  const setNativeLanguage = useSetAtom(nativeLanguageAtom);
  const setEnglish = useSetAtom(englishAtom);
  const setOtherLanguages = useSetAtom(otherLanguagesAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          dialect: '',
          language: '',
        }}
        onSuccess={({ dialect, english, language }) => {
          setNativeLanguage({ dialect, language });
          setEnglish(english ?? true);
        }}
        pageId='native-language'
        sampleData={{
          example: {
            dialect: 'Mexico',
            english: true,
            language: 'es',
          },
        }}
        schema={z.object({
          dialect: z.string(),
          english: required(z.boolean().nullable()).optional(),
          language: z.string().nonempty(),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='language'>
                <QuizFieldTitle />
                <QuizDropdown options={LANGUAGE_OPTIONS} />
              </FormField>
              <FormField control={control} name='dialect'>
                <QuizTextInput hint='optional' />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={(watch('language') ?? 'en') !== 'en'}
              activeValue={null}
              control={control}
              name='english'
            >
              <FormBlock>
                <FormField control={control} name='english'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          languages: [],
        }}
        onSuccess={({ languages }) => setOtherLanguages(languages)}
        pageId='other-languages'
        sampleData={{
          example: {
            languages: ['fr', 'de'],
          },
        }}
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
