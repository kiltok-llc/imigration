import { useAtomValue } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { TranslationContextProvider } from '@/components/trans';
import { userDataFamily } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function ChildrenDetails() {
  const numberOfChildren = useAtomValue(userDataFamily('numberOfChildren'))!;

  return (
    <QuizScreen>
      {Array.from({ length: numberOfChildren }).map((_, i) => (
        <QuizPage
          defaultValues={{
            dob: null,
            ethnicity: '',
            livesInUsa: null,
            name: DEFAULT_NAME,
            sex: null,
          }}
          key={i}
          onSubmit={() => true}
          pageId='child'
          pageKey={i}
          schema={z.object({
            dob: required(z.date().nullable()),
            ethnicity: z.string(),
            livesInUsa: required(z.boolean().nullable()),
            name: NameSchema,
            sex: required(SexEnum.nullable()),
          })}
        >
          {({ control, lens, watch }) => (
            <TranslationContextProvider
              value={{
                context: watch('name.first') ? 'named' : 'unnamed',
                current: i + 1,
                name: watch('name.first'),
                total: numberOfChildren,
              }}
            >
              <QuizPageTitle />

              <FormBlock>
                <QuizFieldTitle name='name' variant='titleLarge' />
                <FormNameInput lens={lens.focus('name')} />
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='sex'>
                  <QuizFieldTitle variant='titleLarge' />
                  <FormSexInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='dob'>
                  <QuizFieldTitle variant='titleLarge' />
                  <QuizDateInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='livesInUsa'>
                  <QuizFieldTitle variant='titleLarge' />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='ethnicity'>
                  <QuizFieldTitle variant='titleLarge' />
                  <QuizTextInput optional />
                </FormField>
              </FormBlock>
            </TranslationContextProvider>
          )}
        </QuizPage>
      ))}
    </QuizScreen>
  );
}
